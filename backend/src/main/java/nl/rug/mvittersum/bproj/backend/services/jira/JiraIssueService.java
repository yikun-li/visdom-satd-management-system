package nl.rug.mvittersum.bproj.backend.services.jira;

import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.entities.jira.JiraIssue;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.JiraIssueRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JiraIssueService {
	private final JiraIssueRepository jiraIssueRepository;

	@Transactional(readOnly = true)
	public Page<JiraIssue> getIssues(Long projectId, Pageable pageable) {
		return jiraIssueRepository.findAllByProjectId(projectId, pageable);
	}

	@Transactional(readOnly = true)
	public JiraIssue getIssue(Long issueId) throws NotFoundException {
		return jiraIssueRepository.findById(issueId).orElseThrow(NotFoundException::new);
	}
}
