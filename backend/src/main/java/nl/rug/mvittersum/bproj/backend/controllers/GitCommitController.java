package nl.rug.mvittersum.bproj.backend.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.data.GitCommentStatistics;
import nl.rug.mvittersum.bproj.backend.dtos.HeatMapTreeDto;
import nl.rug.mvittersum.bproj.backend.dtos.JobDto;
import nl.rug.mvittersum.bproj.backend.dtos.enums.GitHeatMapMode;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitCommitDto;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitFilesResultDto;
import nl.rug.mvittersum.bproj.backend.dtos.requests.CreateSingleGitSnapshotDto;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.mappers.GitCommitMapper;
import nl.rug.mvittersum.bproj.backend.mappers.GitDirectoryMapper;
import nl.rug.mvittersum.bproj.backend.mappers.GitFileMapper;
import nl.rug.mvittersum.bproj.backend.mappers.HeatMapTreeMapper;
import nl.rug.mvittersum.bproj.backend.services.git.GitCommentStatisticsService;
import nl.rug.mvittersum.bproj.backend.services.git.GitCommitService;
import nl.rug.mvittersum.bproj.satd.DebtType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/git-commits")
@RequiredArgsConstructor
@Slf4j
public class GitCommitController {
	private final GitCommitService gitCommitService;
	private final GitCommitMapper gitCommitMapper;
	private final GitFileMapper gitFileMapper;
	private final GitDirectoryMapper gitDirectoryMapper;
	private final HeatMapTreeMapper heatMapTreeMapper;
	private final GitCommentStatisticsService gitCommentStatisticsService;

	@GetMapping
	public Page<GitCommitDto> getCommits(@RequestParam("repositoryId") Long repositoryId,
	                                     @RequestParam(value = "branch", required = false) String branchName, Pageable pageable) throws NotFoundException {
		return gitCommitService.getCommitsInBranch(repositoryId, branchName, pageable).map(gitCommitMapper::toDto);
	}

	@GetMapping("/{commitId}")
	public GitCommitDto getCommit(@PathVariable("commitId") Long commitId) throws NotFoundException {
		return gitCommitMapper.toDto(gitCommitService.getCommit(commitId));
	}

	@GetMapping("/{commitId}/statistics")
	public GitCommentStatistics getCommitStatistics(@PathVariable("commitId") Long commitId) throws NotFoundException {
		var commit = gitCommitService.getCommit(commitId);
		return gitCommentStatisticsService.getStatistics(List.of(commit.getId())).get(commit.getId());
	}

	@GetMapping("/{commitId}/files")
	public GitFilesResultDto getCommit(@PathVariable("commitId") Long commitId,
	                                   @RequestParam(value = "dir", defaultValue = "/") String directory) throws NotFoundException {
		var dirsFiles = gitCommitService.getCommitFilesInDirectory(commitId, directory);

		var files = dirsFiles.getSecond().stream().map(gitFileMapper::toSimpleDto).collect(Collectors.toList());
		var dirs = dirsFiles.getFirst().stream().map(gitDirectoryMapper::toDto).collect(Collectors.toList());

		return gitCommitMapper.toFilesResultDto(directory, files, dirs);
	}


	@GetMapping("/{commitId}/heatmap")
	public HeatMapTreeDto getHeatmap(@PathVariable("commitId") Long commitId,
	                                 @RequestParam(name = "mode", defaultValue = "ALL_COMMENTS") String modeStr,
	                                 @RequestParam(name = "debtType", defaultValue = "DEBT") String debtTypeStr) throws NotFoundException {
		var mode = GitHeatMapMode.valueOf(modeStr);
		var debtType = DebtType.valueOf(debtTypeStr);

		return heatMapTreeMapper.toDto(
				gitCommitService.getCommitFilesMap(commitId),
				mode.getValueFn(debtType)
		);
	}

	@PostMapping("/{commitId}/snap")
	public JobDto snapCommit(@PathVariable("commitId") Long commitId,
	                         @RequestBody CreateSingleGitSnapshotDto body) {
		return null;
	}
}
