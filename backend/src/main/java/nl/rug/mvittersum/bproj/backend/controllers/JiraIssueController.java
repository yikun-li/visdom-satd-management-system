package nl.rug.mvittersum.bproj.backend.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.dtos.jira.JiraIssueDto;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.mappers.JiraIssueMapper;
import nl.rug.mvittersum.bproj.backend.services.jira.JiraIssueService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/jira-issues")
@RequiredArgsConstructor
@Slf4j
public class JiraIssueController {
	private final JiraIssueService jiraIssueService;
	private final JiraIssueMapper jiraIssueMapper;

	@GetMapping
	public Page<JiraIssueDto> getIssues(@RequestParam("projectId") Long jiraProjectId, Pageable pageable) {
		return jiraIssueService.getIssues(jiraProjectId, pageable)
				.map(jiraIssueMapper::toDto);
	}

	@GetMapping("/{issueId}")
	public JiraIssueDto getIssue(@PathVariable("issueId") Long issueId) throws NotFoundException {
		return jiraIssueMapper.toDto(jiraIssueService.getIssue(issueId));
	}
}
