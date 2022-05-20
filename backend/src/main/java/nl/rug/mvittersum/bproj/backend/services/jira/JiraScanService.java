package nl.rug.mvittersum.bproj.backend.services.jira;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.entities.jira.JiraIssue;
import nl.rug.mvittersum.bproj.backend.entities.jira.JiraProject;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.mappers.JiraIssueMapper;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.JiraIssueRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.JiraProjectRepository;
import nl.rug.mvittersum.bproj.backend.utils.JqlHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class JiraScanService {
	private final JiraRequestService jiraRequestService;
	private final JiraIssueMapper jiraIssueMapper;
	private final JiraProjectRepository jiraProjectRepository;
	private final Clock clock;
	private final JiraIssueRepository jiraIssueRepository;

	private Set<JiraIssue> findAllIssues(JiraProject project, String jql) {
		return jiraRequestService.searchIssues(
				project,
				jql,
				Set.of("summary", "issuetype", "created", "updated", "project", "status", "resolution", "description", "comments")
		).stream()
				.map(jiraIssueMapper::fromApiIssue)
				.collect(Collectors.toSet());
	}

	private void updateProject(JiraProject project, Set<JiraIssue> issues) {
		issues.forEach(issue -> issue.setProject(project));
		project.setIssues(issues);
		project.setLastScanned(Date.from(Instant.now(clock)));
		jiraProjectRepository.save(project);
	}

	private void fullScan(JiraProject project) {
		log.info("Scanning entire jira project {}", project.getProjectKey());
		var issues = findAllIssues(project, JqlHelper.getByProject(project));
		log.info("Found {} issues", issues.size());
		updateProject(project, issues);
	}

	private void partialScan(JiraProject project, Instant fromDate) {
		var issues = findAllIssues(project, JqlHelper.getByProjectUpdatedAfter(project, fromDate));
		var keys = issues.stream().map(JiraIssue::getKey).collect(Collectors.toSet());
		var existingIssues = jiraIssueRepository.findAllByProjectIdAndKeyIn(project.getId(), keys).stream()
				.collect(Collectors.toMap(JiraIssue::getKey, (issue) -> issue));

		updateProject(
				project,
				issues.stream()
						.map(issue -> existingIssues.containsKey(issue.getKey())
								? jiraIssueMapper.updateIssue(issue, existingIssues.get(issue.getKey()))
								: issue
						)
						.collect(Collectors.toSet())
		);
	}

	/**
	 * <p>Updates all issues belonging to a Jira project.</p>
	 *
	 * @param projectId The ID of the JiraProject.
	 * @throws NotFoundException Thrown if the JiraProject could not be found.
	 */
	@Transactional
	public void scanJiraProject(Long projectId) throws NotFoundException {
		var project = jiraProjectRepository.findById(projectId).orElseThrow(NotFoundException::new);

		if (project.getLastScanned() == null) {
			// Never scanned before, so perform a full scan
			fullScan(project);
		} else {
			// Just update the issues updated after the last scan
			partialScan(project, project.getLastScanned().toInstant());
		}
	}
}
