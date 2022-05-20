package nl.rug.mvittersum.bproj.backend.jobs;

import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.services.git.GitCodeCommentParsingService;

import java.util.function.Consumer;

@RequiredArgsConstructor
@EqualsAndHashCode
public class FindCommentsJob implements Job.Task {
	private final GitCodeCommentParsingService gitCodeCommentParsingService;
	private final Long branchId;
	private final JobType type = JobType.FIND_COMMENTS;

	@Override
	public void run(Consumer<Job.Task> next) {
		gitCodeCommentParsingService.scanBranch(branchId);
	}

	@Override
	public JobType getType() {
		return type;
	}
}
