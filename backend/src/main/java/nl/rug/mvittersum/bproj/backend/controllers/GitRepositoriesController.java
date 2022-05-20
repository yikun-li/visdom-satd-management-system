package nl.rug.mvittersum.bproj.backend.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.dtos.JobDto;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitBranchDto;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitRepositoryDto;
import nl.rug.mvittersum.bproj.backend.dtos.requests.CreateGitRepositoryDto;
import nl.rug.mvittersum.bproj.backend.dtos.requests.CreateGitSnapshotDto;
import nl.rug.mvittersum.bproj.backend.dtos.requests.StoreBranchDto;
import nl.rug.mvittersum.bproj.backend.dtos.response.*;
import nl.rug.mvittersum.bproj.backend.entities.git.GitBranch;
import nl.rug.mvittersum.bproj.backend.entities.git.GitCommit;
import nl.rug.mvittersum.bproj.backend.entities.git.GitRepository;
import nl.rug.mvittersum.bproj.backend.exceptions.InternalServerException;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.jobs.FetchRepositoryJob;
import nl.rug.mvittersum.bproj.backend.jobs.FindCommentsJob;
import nl.rug.mvittersum.bproj.backend.jobs.SnapshotBranchJob;
import nl.rug.mvittersum.bproj.backend.jobs.StoreCommitsJob;
import nl.rug.mvittersum.bproj.backend.mappers.*;
import nl.rug.mvittersum.bproj.backend.services.JobService;
import nl.rug.mvittersum.bproj.backend.services.git.*;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/git-repositories")
@RequiredArgsConstructor
@Slf4j
public class GitRepositoriesController {
	private final GitRepositoryService gitRepositoryService;
	private final GitRepositoryMapper gitRepositoryMapper;
	private final GitBranchService gitBranchService;
	private final GitBranchMapper gitBranchMapper;
	private final JobService jobService;
	private final GitCodeCommentParsingService gitCodeCommentParsingService;
	private final JobMapper jobMapper;
	private final GitSnapshotCreationService gitSnapshotCreationService;
	private final GitCommitMapper gitCommitMapper;
	private final GitCommitService gitCommitService;
	private final GitSnapshotMapper gitSnapshotMapper;
	private final GitCommentStatisticsService gitCommentStatisticsService;

	@GetMapping
	public List<GitRepositoryDto> getRepositories(@RequestParam("projectId") Long projectId) {
		return gitRepositoryService.getRepositoriesForProject(projectId)
				.stream()
				.map(repository -> gitRepositoryMapper.toDto(repository, gitRepositoryService.isStored(repository)))
				.collect(Collectors.toList());
	}

	@PostMapping
	public CreateGitRepositoryResponseDto createRepository(@RequestBody CreateGitRepositoryDto body) throws NotFoundException {
		var tuple = gitRepositoryService.createRepository(
				body.getProjectId(),
				gitRepositoryMapper.fromCreateRequest(body)
		);

		return CreateGitRepositoryResponseDto.builder()
				.repository(gitRepositoryMapper.toDto(tuple.getFirst()))
				.cloneJob(jobMapper.toDto(tuple.getSecond()))
				.build();
	}

	@GetMapping("/{repositoryId}")
	public GetGitRepositoryResponseDto getRepository(@PathVariable("repositoryId") Long repositoryId,
	                                                 @RequestParam(value = "branch", required = false) String branchName) throws NotFoundException {
		GitRepository repository;
		GitBranch branch;
		GitCommit latestCommit;
		Optional<GitCommit> latestSnappedCommit;

		try {
			branch = gitRepositoryService.getBranchWithRepository(repositoryId, branchName);
			repository = branch.getRepository();
			latestCommit = gitCommitService.getLatestInBranch(branch).orElse(null);
			latestSnappedCommit = gitCommitService.getLatestInBranchWithSnapshot(branch);
			latestSnappedCommit.ifPresent(commit -> commit.getSnapshot()
					.setStatistics(
							gitCommentStatisticsService.getStatistics(List.of(commit.getId())).get(commit.getId())
					)
			);

			gitBranchService.getTotalCommitsInBranch(List.of(branch));
		} catch (NotFoundException nfe) {
			repository = gitRepositoryService.getRepository(repositoryId);
			branch = null;
			latestCommit = null;
			latestSnappedCommit = Optional.empty();
		}

		return GetGitRepositoryResponseDto.builder()
				.repository(gitRepositoryMapper.toDto(repository, gitRepositoryService.isStored(repository)))
				.branch(gitBranchMapper.toDto(branch))
				.latestCommit(gitCommitMapper.toDto(latestCommit))
				.latestSnapshot(
						latestSnappedCommit.map(commit -> gitSnapshotMapper.toDto(commit.getSnapshot(), List.of(commit.getId())))
								.orElse(null)
				)
				.build();
	}

	@GetMapping("/{repositoryId}/branches")
	public List<GitBranchDto> getBranches(@PathVariable("repositoryId") Long repositoryId) throws NotFoundException {
		try {
			return gitBranchService.getAllBranches(repositoryId).stream()
					.map(gitBranchMapper::toDto)
					.collect(Collectors.toList());
		} catch (GitAPIException | IOException e) {
			throw new InternalServerException(e);
		}
	}

	@PostMapping("/{repositoryId}/branches")
	public StoreGitBranchResponseDto storeBranchWithCommits(@PathVariable("repositoryId") Long repositoryId,
	                                                        @RequestBody StoreBranchDto body) throws NotFoundException {
		var branch = gitBranchService.createBranch(repositoryId, body.getBranch());
		var job = new StoreCommitsJob(gitBranchService, repositoryId, List.of(branch.getId()));

		return StoreGitBranchResponseDto.builder()
				.branch(gitBranchMapper.toDto(branch))
				.storeJob(jobMapper.toDto(jobService.runWithTransaction(job)))
				.build();
	}

	@PostMapping("/{repositoryId}/fetch")
	public JobDto gitFetchRepository(@PathVariable("repositoryId") Long repositoryId) {
		var job = new FetchRepositoryJob(gitRepositoryService, gitBranchService, repositoryId);
		return jobMapper.toDto(jobService.runWithTransaction(job));
	}

	@GetMapping("/{repositoryId}/snap")
	public GetCreateSnapshotsInfoResponseDto getCreateSnapshotsInfo(
			@PathVariable("repositoryId") Long repositoryId,
			@RequestParam(value = "branch") String branchName,
			@RequestParam(value = "from", required = false) String fromStr,
			@RequestParam(value = "to", required = false) String toStr
	) throws NotFoundException {
		var branch = gitRepositoryService.getBranchWithRepository(repositoryId, branchName);

		return GetCreateSnapshotsInfoResponseDto.builder()

				.build();
	}

	@PostMapping("/{repositoryId}/snap")
	public JobDto snapshotBranch(@PathVariable("repositoryId") Long repositoryId, @RequestBody CreateGitSnapshotDto body) {
		var job = new SnapshotBranchJob(gitSnapshotCreationService, repositoryId, body);
		return jobMapper.toDto(jobService.runWithTransaction(job));
	}

	@PostMapping("/{repositoryId}/scan")
	public JobDto scanBranchForComments(@PathVariable("repositoryId") Long repositoryId,
	                                    @RequestParam("branch") String branchName) throws NotFoundException {
		var branch = gitBranchService.getBranch(repositoryId, branchName).orElseThrow(NotFoundException::new);
		var job = new FindCommentsJob(gitCodeCommentParsingService, branch.getId());
		return jobMapper.toDto(jobService.runWithTransaction(job));
	}

	@GetMapping("/{repositoryId}/statistics")
	public GetGitBranchStatisticsResponseDto getRepositoryStatistics(
			@PathVariable("repositoryId") Long repositoryId,
			@RequestParam(value = "branch", required = false) String branchName,
			@RequestParam("from") String fromStr,
			@RequestParam("to") String toStr,
			@RequestParam("interval") Integer interval
	) throws NotFoundException {
		var from = Instant.parse(fromStr);
		var to = Instant.parse(toStr);
		var branch = gitRepositoryService.getBranchWithRepository(repositoryId, branchName);
		var commits = gitCommitService.findCommitsFromToInBranch(branch, from, to, Duration.ofSeconds(interval));
		var stats = gitCommitService.getBranchStatistics(commits);

		return GetGitBranchStatisticsResponseDto.builder()
				.from(from.toString())
				.to(to.toString())
				.interval(interval)
				.branchName(branch.getName())
				.data(commits.stream()
						.map(commit -> gitCommitMapper.toStatisticsDto(commit, stats.get(commit.getId())))
						.collect(Collectors.toList())
				)
				.build();
	}
}
