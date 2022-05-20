package nl.rug.mvittersum.bproj.backend.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.jobs.Job;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Clock;
import java.util.*;
import java.util.function.Supplier;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {
	private final Map<UUID, Job<? extends Job.Task>> jobs = new HashMap<>();

	private final List<TaskExecutor> executor;
	private final Supplier<UUID> uuidGenerator;
	private final TransactionTemplate transactionTemplate;
	private final Clock clock;

	/**
	 * <p>Runs a task (a {@link Job.Task} and returns a {@link Job}.</p>
	 *
	 * @param task A task, which is an object that has Runnable implemented.
	 * @param <T>  A class that implements Runnable, so it can be executed.
	 * @return A Job object, containing information about the task (state, exception, etc.).
	 */
	public <T extends Job.Task> Job<T> run(T task) {
		var job = new Job<>(task, uuidGenerator.get(), clock);
		executor.get(0).execute(getRunnableFromJob(job));
		jobs.put(job.getId(), job);
		return job;
	}

	/**
	 * @param task
	 * @param <T>
	 * @return
	 */
	public <T extends Job.Task> Job<T> runWithTransaction(T task) {
		var job = new Job<>(task, uuidGenerator.get(), clock);
		executor.get(0).execute(() -> transactionTemplate.execute((TransactionCallback<Void>) (TransactionStatus status) -> {
			getRunnableFromJob(job).run();
			return null;
		}));
		jobs.put(job.getId(), job);
		return job;
	}


	/**
	 * <p></p>
	 *
	 * @param id The ID of the job.
	 * @return An optional object with a Job instance if the job was found, otherwise an empty instance.
	 */
	public Optional<Job<? extends Job.Task>> findJob(UUID id) {
		return jobs.containsKey(id) ? Optional.of(jobs.get(id)) : Optional.empty();
	}

	private Runnable getRunnableFromJob(Job<?> job) {
		return () -> {
			try {
				jobLoop(job);
			} catch (Throwable throwable) {
				throw new RuntimeException("Error thrown in job", throwable);
			}
		};
	}

	private void jobLoop(Job<?> job) throws Throwable {
		do {
			log.info("Starting job {}", job);
			job.start();

			if (job.getNext() != null) {
				Job.Task nextTask = job.getNext();
				UUID nextJobId = uuidGenerator.get();
				job.setNextId(nextJobId);
				job = new Job<>(nextTask, nextJobId, clock);
				jobs.put(job.getId(), job);
				log.info("Creating next job {}", job);
			}
		} while (job.getState() == Job.JobState.READY);
	}
}
