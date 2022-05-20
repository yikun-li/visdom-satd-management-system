package nl.rug.mvittersum.bproj.backend.jobs;

import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.GitRepositoryRepository;
import nl.rug.mvittersum.bproj.backend.utils.GitHelper;

import java.io.File;
import java.util.function.Consumer;

@RequiredArgsConstructor
@Slf4j
@EqualsAndHashCode
@ToString
public class CloneRepositoryJob implements Job.Task {
	private final GitRepositoryRepository gitRepositoryRepository;
	private final Long repositoryId;
	private final File location;

	@Override
	public void run(Consumer<Job.Task> next) throws Throwable {
		var repository = gitRepositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);

		log.info("Cloning {}", repository.getUrl());
		var git = GitHelper.clone(repository.getUrl(), location);
		log.info("Finished cloning {}", repository.getUrl());

		repository.setDefaultBranch(git.getRepository().getBranch());
		gitRepositoryRepository.save(repository);
	}

	@Override
	public JobType getType() {
		return JobType.CLONE_REPOSITORY;
	}
}
