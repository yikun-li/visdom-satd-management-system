package nl.rug.mvittersum.bproj.backend.jobs;

import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.services.git.GitBranchService;

import java.util.List;
import java.util.function.Consumer;

@RequiredArgsConstructor
@Slf4j
@EqualsAndHashCode
public class StoreCommitsJob implements Job.Task {
	private final GitBranchService gitBranchService;
	private final Long repositoryId;
	private final List<Long> branchIds;

	@Override
	public void run(Consumer<Job.Task> next) throws Throwable {
		gitBranchService.storeCommitsForBranches(repositoryId, branchIds);
	}

	@Override
	public JobType getType() {
		return null;
	}
}
