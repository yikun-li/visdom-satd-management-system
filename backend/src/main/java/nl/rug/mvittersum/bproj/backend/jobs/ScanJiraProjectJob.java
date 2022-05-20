package nl.rug.mvittersum.bproj.backend.jobs;

import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.services.jira.JiraScanService;

import java.util.function.Consumer;

@RequiredArgsConstructor
@Slf4j
@EqualsAndHashCode
public class ScanJiraProjectJob implements Job.Task {
	private final JiraScanService jiraScanService;
	private final Long projectId;

	@Override
	public void run(Consumer<Job.Task> next) throws Throwable {
		jiraScanService.scanJiraProject(projectId);
	}

	@Override
	public JobType getType() {
		return null;
	}
}
