package nl.rug.mvittersum.bproj.backend.jobs;

import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.entities.git.GitBranch;
import nl.rug.mvittersum.bproj.backend.services.git.GitBranchService;
import nl.rug.mvittersum.bproj.backend.services.git.GitRepositoryService;

import java.util.function.Consumer;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@EqualsAndHashCode
@Slf4j
public class FetchRepositoryJob implements Job.Task {
	private final GitRepositoryService gitRepositoryService;
	private final GitBranchService gitBranchService;
	private final Long repositoryId;

	@Override
	public void run(Consumer<Job.Task> next) throws Throwable {
		try {
			var repository = gitRepositoryService.fetchLocalRepository(repositoryId);
			gitBranchService.storeCommitsForBranches(repositoryId, repository.getBranches().stream().map(GitBranch::getId).collect(Collectors.toList()));
		} catch (Exception e) {
			log.error("FetchRepositoryJob failed", e);
		}
	}

	@Override
	public JobType getType() {
		return null;
	}
}
