package nl.rug.mvittersum.bproj.backend.jobs;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.Clock;
import java.time.Instant;
import java.util.UUID;
import java.util.function.Consumer;

@Slf4j
@RequiredArgsConstructor
@Getter
@EqualsAndHashCode
@ToString
public class Job<T extends Job.Task> {
	private final T task;
	private final UUID id;
	private final Clock clock;

	private Instant start = null;
	private Instant stop = null;
	private JobState state = JobState.READY;
	private Throwable exception;
	private Task next = null;

	@Setter
	private UUID nextId;

	public void start() throws Throwable {
		try {
			state = JobState.RUNNING;
			start = Instant.now(clock);
			task.run((task) -> {
				log.info("Received next task {}", task);
				next = task;
			});
			finish();
		} catch (Throwable throwable) {
			log.error("Job failed", throwable);
			state = JobState.ERRORED;
			exception = throwable;
			throw throwable;
		}
	}

	private void finish() {
		state = next == null ? JobState.FINISHED : JobState.CONTINUED;
		stop = Instant.now(clock);
	}

	public long getRunningTime() {
		return start == null
				? 0
				: (stop == null ? Instant.now(clock).toEpochMilli() : stop.toEpochMilli()) - start.toEpochMilli();
	}

	public JobType getType() {
		return task.getType();
	}

	public enum JobState {
		READY,
		RUNNING,
		FINISHED,
		ERRORED,
		CONTINUED
	}

	public interface Task {
		void run(Consumer<Task> next) throws Throwable;

		JobType getType();
	}
}
