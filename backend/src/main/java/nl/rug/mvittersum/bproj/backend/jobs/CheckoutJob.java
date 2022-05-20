package nl.rug.mvittersum.bproj.backend.jobs;

import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.services.git.GitClientService;
import nl.rug.mvittersum.bproj.backend.utils.GitHelper;

import java.util.function.Consumer;

@RequiredArgsConstructor
public class CheckoutJob implements Job.Task {
	private final JobType type = JobType.PULL;
	private final GitClientService gitClientService;

	private final String branch;
	private final Long repositoryId;
	private final Job.Task nextTask;

	@Override
	public void run(Consumer<Job.Task> next) throws Throwable {
		var client = gitClientService.getClient(repositoryId);
		GitHelper.checkoutBranch(client, branch);
		next.accept(nextTask);
	}

	@Override
	public JobType getType() {
		return type;
	}
}
