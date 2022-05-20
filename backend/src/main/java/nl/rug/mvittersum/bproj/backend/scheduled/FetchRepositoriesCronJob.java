package nl.rug.mvittersum.bproj.backend.scheduled;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.jobs.FetchRepositoryJob;
import nl.rug.mvittersum.bproj.backend.repositories.jdbc.GitRepositoryJdbcRepository;
import nl.rug.mvittersum.bproj.backend.services.JobService;
import nl.rug.mvittersum.bproj.backend.services.git.GitBranchService;
import nl.rug.mvittersum.bproj.backend.services.git.GitRepositoryService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
@RequiredArgsConstructor
@Slf4j
public class FetchRepositoriesCronJob {
	private final GitRepositoryJdbcRepository gitRepositoryJdbcRepository;
	private final GitRepositoryService gitRepositoryService;
	private final GitBranchService gitBranchService;
	private final JobService jobService;

	@Scheduled(cron = "0 */10 * * * *")
	public void job() {
		for (var id : gitRepositoryJdbcRepository.getRepositoriesToUpdate()) {
			jobService.runWithTransaction(new FetchRepositoryJob(gitRepositoryService, gitBranchService, id));
		}
	}
}
