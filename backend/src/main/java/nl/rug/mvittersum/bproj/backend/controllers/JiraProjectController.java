package nl.rug.mvittersum.bproj.backend.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.data.JiraProjectStatistics;
import nl.rug.mvittersum.bproj.backend.dtos.JobDto;
import nl.rug.mvittersum.bproj.backend.dtos.jira.JiraProjectDto;
import nl.rug.mvittersum.bproj.backend.dtos.requests.CreateJiraProjectDto;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.jobs.ScanJiraProjectJob;
import nl.rug.mvittersum.bproj.backend.mappers.JiraProjectMapper;
import nl.rug.mvittersum.bproj.backend.mappers.JobMapper;
import nl.rug.mvittersum.bproj.backend.services.JobService;
import nl.rug.mvittersum.bproj.backend.services.jira.JiraProjectService;
import nl.rug.mvittersum.bproj.backend.services.jira.JiraScanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/jira-projects")
@RequiredArgsConstructor
@Slf4j
public class JiraProjectController {
	private final JiraProjectService jiraProjectService;
	private final JiraProjectMapper jiraProjectMapper;
	private final JobService jobService;
	private final JobMapper jobMapper;
	private final JiraScanService jiraScanService;

	@GetMapping
	public List<JiraProjectDto> getProjects(@RequestParam("url") String url, @RequestParam(value = "user", required = false) String user,
	                                        @RequestParam(value = "pass", required = false) String password) {
		return jiraProjectService.getRemoteProjects(url, user, password)
				.stream()
				.map(jiraProjectMapper::toDto)
				.collect(Collectors.toList());
	}

	@PostMapping
	public JiraProjectDto createJiraProject(@RequestBody CreateJiraProjectDto body) throws NotFoundException {
		var project = jiraProjectMapper.fromCreateJiraProjectDto(body);
		return jiraProjectMapper.toDto(jiraProjectService.createProject(body.getProjectId(), project));
	}

	@GetMapping("/{jiraProjectId}")
	public JiraProjectDto getJiraProject(@PathVariable("jiraProjectId") Long jiraProjectId) throws NotFoundException {
		return jiraProjectMapper.toDto(jiraProjectService.getProject(jiraProjectId));
	}

	@GetMapping("/{jiraProjectId}/statistics")
	public JiraProjectStatistics getJiraProjectStatistics(@PathVariable("jiraProjectId") Long jiraProjectId) throws NotFoundException {
		return jiraProjectService.getStatistics(jiraProjectId);
	}

	@PostMapping("/{jiraProjectId}/scan")
	public JobDto scanJiraProject(@PathVariable("jiraProjectId") Long jiraProjectId) {
		var job = new ScanJiraProjectJob(jiraScanService, jiraProjectId);
		return jobMapper.toDto(jobService.runWithTransaction(job));
	}
}
