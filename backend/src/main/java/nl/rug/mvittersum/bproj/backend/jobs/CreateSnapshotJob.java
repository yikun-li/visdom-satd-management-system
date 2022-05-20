package nl.rug.mvittersum.bproj.backend.jobs;

import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.entities.git.GitSnapshot;
import org.springframework.lang.Nullable;

import java.util.function.Consumer;
import java.util.function.Function;

@RequiredArgsConstructor
@Slf4j
@EqualsAndHashCode
public class CreateSnapshotJob implements Job.Task {
	private final JobType type = JobType.CREATE_SNAPSHOT;

	@Nullable
	private final Function<GitSnapshot, Job.Task> nextTask;

	@Override
	public void run(Consumer<Job.Task> next) throws Throwable {
	}

	@Override
	public JobType getType() {
		return type;
	}
}
