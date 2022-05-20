package nl.rug.mvittersum.bproj.backend.services.git;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.data.GitCommentStatistics;
import nl.rug.mvittersum.bproj.backend.data.GitDirectory;
import nl.rug.mvittersum.bproj.backend.entities.git.GitBranch;
import nl.rug.mvittersum.bproj.backend.entities.git.GitCommit;
import nl.rug.mvittersum.bproj.backend.entities.git.GitFile;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.mappers.GitCommitMapper;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.GitCommitRepository;
import nl.rug.mvittersum.bproj.backend.utils.CompareUtil;
import nl.rug.mvittersum.bproj.backend.utils.GitHelper;
import nl.rug.mvittersum.bproj.backend.utils.StatisticsDataUtil;
import nl.rug.mvittersum.bproj.backend.utils.Tuples;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.revwalk.RevCommit;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GitCommitService {
	private final GitClientService gitClientService;
	private final GitCommitMapper gitCommitMapper;
	private final GitCommitRepository gitCommitRepository;
	private final GitSnapshotFileService gitSnapshotFileService;
	private final GitRepositoryService gitRepositoryService;
	private final GitFileService gitFileService;
	private final GitCommentStatisticsService gitCommentStatisticsService;

	@Transactional(readOnly = true)
	public GitCommit getCommit(Long commitId) throws NotFoundException {
		return gitCommitRepository.findByIdWithSnapshot(commitId).orElseThrow(NotFoundException::new);
	}

	@Transactional(readOnly = true)
	public Tuples.Double<Collection<GitDirectory>, Collection<GitFile>> getCommitFilesInDirectory(Long commitId, String directory) throws NotFoundException {
		var commit = getCommit(commitId);
		if (commit.getSnapshot() == null) throw new NotFoundException();
		var directories = gitSnapshotFileService.getFilesInDirectory(commit.getSnapshot(), directory);
		gitCommentStatisticsService.loadDirectoryStatistics(directories.values());

		List<GitFile> rootFiles = directories.containsKey("") ? directories.get("").getFiles() : Collections.emptyList();
		directories.remove("");

		return new Tuples.Double<>(directories.values(), rootFiles);
	}

	@Transactional(readOnly = true)
	public Map<String, Collection<GitFile>> getCommitFilesMap(Long commitId) throws NotFoundException {
		var commit = getCommit(commitId);
		if (commit.getSnapshot() == null) throw new NotFoundException();
		return gitFileService.getSnapshotFileMap(commit.getSnapshot().getId());
	}

	public Set<GitCommit> createCommitsForBranch(GitBranch branch, Map<String, GitCommit> commitMap) throws IOException, GitAPIException, NotFoundException {
		log.info("Checking out branch {}", branch.getName());
		var git = gitClientService.getClient(branch.getRepository());
		gitRepositoryService.fetchLocalRepository(branch.getRepository().getId());
		GitHelper.checkoutBranch(git, branch.getName());
		git.pull().setRemoteBranchName(branch.getName()).setRemote("origin").call();

		var commits = new HashSet<GitCommit>();
		var findParents = new ArrayList<Tuples.Double<GitCommit, RevCommit>>();
		for (var commit : GitHelper.getCommitsFromStart(git)) {
			commits.add(findOrCreateCommit(commitMap, commit, findParents));
		}
		for (var tuple : findParents) {
			tuple.getFirst().setParent(findParent(commitMap, tuple.getSecond()));
		}

		return commits;
	}

	@Transactional(readOnly = true)
	public Page<GitCommit> getCommitsInBranch(Long repositoryId, String branchName, Pageable pageable) throws NotFoundException {
		var branch = gitRepositoryService.getBranchWithRepository(repositoryId, branchName);
		return gitCommitRepository.findAllInBranch(branch.getId(), pageable);
	}

	@Transactional(readOnly = true)
	public List<GitFile> getFiles(Long commitId) throws NotFoundException {
		var commit = gitCommitRepository.findById(commitId).orElseThrow(NotFoundException::new);
		var snapshot = commit.getSnapshot();
		if (snapshot == null) throw new NotFoundException();
		var files = gitFileService.getSnapshotFiles(snapshot.getId());
		files.forEach(file -> Hibernate.initialize(file.getComments()));
		return files;
	}

	private GitCommit findOrCreateCommit(Map<String, GitCommit> commitMap, RevCommit commit, List<Tuples.Double<GitCommit, RevCommit>> findParents) {
		var hash = commit.getId().getName();

		if (commitMap.containsKey(hash)) {
			var gitCommit = commitMap.get(hash);
			return gitCommit.getId() != null
					? gitCommitRepository.getOne(gitCommit.getId())
					: gitCommit;
		} else {
			// log.info("Miss, creating new commit {}", commit.getId().getName());
			var gitCommit = gitCommitMapper.fromRevCommit(commit);
			commitMap.put(gitCommit.getHash(), gitCommit);
			findParents.add(new Tuples.Double<>(gitCommit, commit));
			return gitCommit;
		}
	}

	/**
	 * <p>Does a BFS for an existing parent.</p>
	 */
	private GitCommit findParent(Map<String, GitCommit> commitMap, RevCommit commit) {
		var queue = new ArrayDeque<>(Arrays.asList(commit.getParents()));
		int depth = 0;
		int currentLevel = queue.size();

		while (!queue.isEmpty()) {
			var c = queue.removeFirst();
			if (commitMap.containsKey(c.getId().getName())) {
				return commitMap.get(c.getId().getName());
			}

			queue.addAll(Arrays.asList(c.getParents()));
			currentLevel--;
			if (currentLevel == 0) {
				depth++;
				currentLevel = queue.size();
			}

			if (depth > 10) {
				return null;
			}
		}

		return null;
	}

	@Transactional(readOnly = true)
	public Map<Long, GitCommentStatistics> getBranchStatistics(List<GitCommit> commits) throws NotFoundException {
		return gitCommentStatisticsService.getStatistics(commits.stream().map(GitCommit::getId).collect(Collectors.toList()));
	}

	@Transactional(readOnly = true)
	public Optional<GitCommit> getLatestInBranch(GitBranch branch) {
		var commits = gitCommitRepository.findLastCommitInBranch(branch.getRepository().getId(), branch.getName(), PageRequest.of(0, 1));
		return commits.isEmpty() ? Optional.empty() : Optional.of(commits.get(0));
	}

	@Transactional(readOnly = true)
	public Optional<GitCommit> getLatestInBranchWithSnapshot(GitBranch branch) {
		var commits = gitCommitRepository.findLastCommitInBranchWithSnapshot(branch.getRepository().getId(), branch.getName(), PageRequest.of(0, 1));
		return commits.isEmpty() ? Optional.empty() : Optional.of(commits.get(0));
	}

	@Transactional(readOnly = true)
	public List<GitCommit> findCommitsFromToInBranch(GitBranch branch, Instant from, Instant to, Duration interval) {
		return StatisticsDataUtil.orderedSkipInterval(
				branch.getCommits().stream()
						.sorted(CompareUtil.compareDates(GitCommit::getCommitDate))
						.filter(StatisticsDataUtil.filterBefore(Date.from(from), GitCommit::getCommitDate))
						.filter(StatisticsDataUtil.filterAfter(Date.from(to), GitCommit::getCommitDate))
						.collect(Collectors.toList()),
				GitCommit::getCommitDate,
				interval
		);
	}
}
