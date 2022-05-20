package nl.rug.mvittersum.bproj.backend.services.git;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.entities.git.GitBranch;
import nl.rug.mvittersum.bproj.backend.entities.git.GitCommit;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.mappers.GitBranchMapper;
import nl.rug.mvittersum.bproj.backend.repositories.jdbc.GitCommitJdbcRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.GitBranchRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.GitCommitRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.GitRepositoryRepository;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GitBranchService {
	private final GitBranchRepository gitBranchRepository;
	private final GitCommitService gitCommitService;
	private final GitRepositoryRepository gitRepositoryRepository;
	private final GitCommitJdbcRepository gitCommitJdbcRepository;
	private final GitClientService gitClientService;
	private final GitBranchMapper gitBranchMapper;

	@Transactional
	public GitBranch createBranch(Long repositoryId, String branchName) throws NotFoundException {
		var repository = gitRepositoryRepository.findById(repositoryId)
				.orElseThrow(NotFoundException::new);

		var branch = new GitBranch();
		branch.setName(branchName);
		branch.setRepository(repository);
		branch.setStored(true);
		return gitBranchRepository.save(branch);
	}

	@Transactional
	public void storeCommitsForBranches(Long repositoryId, List<Long> branchIds) throws GitAPIException, NotFoundException, IOException {
		var commitMap = gitCommitJdbcRepository.getCommitHashMap(repositoryId);
		log.info("Fetched map for repository {} with {} entries", repositoryId, commitMap.size());
		for (var branchId : branchIds) {
			storeCommitsInBranch(branchId, commitMap);
		}
	}

	private void storeCommitsInBranch(Long branchId, Map<String, GitCommit> commitMap) throws GitAPIException, IOException, NotFoundException {
		var branch = gitBranchRepository.findById(branchId).orElseThrow(NotFoundException::new);
		branch.getCommits().addAll(gitCommitService.createCommitsForBranch(branch, commitMap));
		branch = gitBranchRepository.save(branch);
		branch.getCommits().forEach(commit -> commitMap.put(commit.getHash(), commit));
		log.info("Stored {} commits for branch {}", branch.getCommits().size(), branchId);
	}

	@Transactional
	public Optional<GitBranch> getBranch(Long repositoryId, String name) {
		return gitBranchRepository.findByRepositoryIdAndName(repositoryId, name);
	}

	@Transactional(readOnly = true)
	public void getTotalCommitsInBranch(List<GitBranch> branches) {
		var map = branches.stream().collect(Collectors.toMap(GitBranch::getId, (branch) -> branch));

		gitCommitJdbcRepository.getTotalCommitsInBranch(map.keySet()).forEach((id, tuple) -> {
			var branch = map.get(id);
			branch.setTotalCommits(tuple.getFirst());
			branch.setTotalSnapped(tuple.getSecond());
		});
	}

	@Transactional(readOnly = true)
	public List<GitBranch> getAllBranches(Long repositoryId) throws NotFoundException, GitAPIException, IOException {
		var repository = gitRepositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);
		var branches = new ArrayList<>(repository.getBranches());
		getTotalCommitsInBranch(branches);
		var remoteBranches = gitClientService.getRemoteBranches(repository);

		for (var branch : branches) {
			remoteBranches.remove(branch.getName());
			branch.setStored(true);
		}

		branches.addAll(remoteBranches.stream().map(gitBranchMapper::fromRemoteName).collect(Collectors.toList()));

		return branches;
	}
}
