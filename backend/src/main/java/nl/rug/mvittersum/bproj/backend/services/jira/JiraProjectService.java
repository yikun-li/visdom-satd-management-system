package nl.rug.mvittersum.bproj.backend.services.jira;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.data.JiraProjectStatistics;
import nl.rug.mvittersum.bproj.backend.entities.jira.JiraProject;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.mappers.JiraProjectMapper;
import nl.rug.mvittersum.bproj.backend.repositories.jdbc.JiraStatisticsJdbcRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.JiraProjectRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class JiraProjectService {
	private final JiraRequestService jiraRequestService;
	private final JiraProjectMapper jiraProjectMapper;
	private final ProjectRepository projectRepository;
	private final JiraProjectRepository jiraProjectRepository;
	private final JiraStatisticsJdbcRepository jiraStatisticsJdbcRepository;

	public List<JiraProject> getRemoteProjects(String url, String username, String password) {
		var tempProject = JiraProject.builder().url(url).username(username).password(password).build();
		var client = jiraRequestService.getClient(tempProject);
		var projects = new ArrayList<JiraProject>();
		client.getProjectClient().getAllProjects().claim().forEach(project -> projects.add(jiraProjectMapper.fromBasicProject(project)));
		return projects;
	}

	@Transactional
	public JiraProject createProject(Long projectId, JiraProject jiraProject) throws NotFoundException {
		jiraProject.setProject(projectRepository.findById(projectId).orElseThrow(NotFoundException::new));
		validateJiraConnection(jiraProject);
		jiraProject = jiraProjectRepository.save(jiraProject);
		return jiraProject;
	}

	private void validateJiraConnection(JiraProject jiraProject) throws NotFoundException {
		try {
			var client = jiraRequestService.getClient(jiraProject);
			var project = client.getProjectClient().getProject(jiraProject.getProjectKey()).claim();
			jiraProject.setProjectName(project.getName());
		} catch (Exception e) {
			log.warn("Failed to validate", e);
			throw new NotFoundException();
		}
	}

	@Transactional(readOnly = true)
	public JiraProject getProject(Long id) throws NotFoundException {
		return jiraProjectRepository.findById(id).orElseThrow(NotFoundException::new);
	}

	@Transactional(readOnly = true)
	public JiraProjectStatistics getStatistics(Long id) throws NotFoundException {
		return Optional.ofNullable(jiraStatisticsJdbcRepository.getProjectStatistics(List.of(id)).get(id))
				.orElseThrow(NotFoundException::new);
	}
}
