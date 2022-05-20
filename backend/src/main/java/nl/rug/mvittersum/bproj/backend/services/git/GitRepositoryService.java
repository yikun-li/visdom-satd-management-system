package nl.rug.mvittersum.bproj.backend.services.git;

import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.entities.git.GitBranch;
import nl.rug.mvittersum.bproj.backend.entities.git.GitCommit;
import nl.rug.mvittersum.bproj.backend.entities.git.GitRepository;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.jobs.CloneRepositoryJob;
import nl.rug.mvittersum.bproj.backend.jobs.Job;
import nl.rug.mvittersum.bproj.backend.mappers.GitBranchMapper;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.GitBranchRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.GitRepositoryRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.ProjectRepository;
import nl.rug.mvittersum.bproj.backend.services.JobService;
import nl.rug.mvittersum.bproj.backend.utils.GitHelper;
import nl.rug.mvittersum.bproj.backend.utils.Tuples;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Nullable;
import java.io.IOException;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GitRepositoryService {
	private final GitClientService gitClientService;
	private final GitRepositoryRepository gitRepositoryRepository;
	private final ProjectRepository projectRepository;
	private final JobService jobService;
	private final GitBranchRepository gitBranchRepository;
	private final Clock clock;

	@Transactional
	public GitBranch getBranchWithRepository(Long repositoryId, @Nullable String branchName) throws NotFoundException {
		var branch = (branchName == null
				? gitBranchRepository.findByRepositoryIdAsDefaultBranch(repositoryId)
				: gitBranchRepository.findByRepositoryIdAndName(repositoryId, branchName))
				.orElseThrow(NotFoundException::new);
		branch.setStored(true);
		return branch;
	}

	@Transactional
	public GitRepository getRepository(Long repositoryId) throws NotFoundException {
		return gitRepositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);
	}

	@Transactional
	public List<GitRepository> getRepositoriesForProject(Long projectId) {
		return gitRepositoryRepository.findAllByProjectId(projectId);
	}

	@Transactional
	public Tuples.Double<GitRepository, Job<CloneRepositoryJob>> createRepository(Long projectId, GitRepository repository) throws NotFoundException {
		repository.setProject(projectRepository.findById(projectId).orElseThrow(NotFoundException::new));
		repository = gitRepositoryRepository.save(repository);

		return new Tuples.Double<>(
				repository,
				jobService.run(new CloneRepositoryJob(
						gitRepositoryRepository,
						repository.getId(),
						gitClientService.getRepositoryLocation(repository)
				))
		);
	}

	@Transactional
	public GitRepository fetchLocalRepository(Long repositoryId) throws NotFoundException, IOException, GitAPIException {
		var repository = getRepository(repositoryId);
		var client = gitClientService.getClient(repository);
		client.fetch().call();
		repository.setLastFetched(Date.from(Instant.now(clock)));
		return gitRepositoryRepository.save(repository);
	}

	public boolean isStored(GitRepository repository) {
		return GitHelper.isGitDirectory(gitClientService.getRepositoryLocation(repository));
	}
}
