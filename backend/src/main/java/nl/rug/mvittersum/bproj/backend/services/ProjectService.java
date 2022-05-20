package nl.rug.mvittersum.bproj.backend.services;

import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.dtos.SourceDto;
import nl.rug.mvittersum.bproj.backend.entities.Project;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.mappers.SourcesMapper;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.GitRepositoryRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.JiraProjectRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.ProjectRepository;
import nl.rug.mvittersum.bproj.backend.utils.Tuples;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ProjectService {
	private final ProjectRepository projectRepository;
	private final GitRepositoryRepository gitRepositoryRepository;
	private final SourcesMapper sourcesMapper;
	private final JiraProjectRepository jiraProjectRepository;
	private final Clock clock;

	@Transactional(readOnly = true)
	public List<Project> getAll() {
		var projects = projectRepository.findAll();
		projects.forEach(project -> project.setAmountOfSources(new Tuples.Double<>(project.getJiraProjects().size(), project.getGitRepositories().size())));
		return projects;
	}

	@Transactional(readOnly = true)
	public Project get(Long id) throws NotFoundException {
		return projectRepository.findById(id).orElseThrow(NotFoundException::new);
	}

	@Transactional(readOnly = true)
	public List<SourceDto> getSources(Long id) {
		Stream<SourceDto> git = gitRepositoryRepository.findAllByProjectId(id).stream().map(sourcesMapper::toDto);
		Stream<SourceDto> jira = jiraProjectRepository.findAllByProjectId(id).stream().map(sourcesMapper::toDto);

		return Stream.concat(git, jira).collect(Collectors.toList());
	}

	@Transactional
	public Project createProject(Project project) {
		return projectRepository.save(project);
	}

	@Transactional
	public Project setLastUpdated(Long projectId) throws NotFoundException {
		var project = projectRepository.findById(projectId).orElseThrow(NotFoundException::new);
		project.setLastUpdated(Date.from(Instant.now(clock)));
		return projectRepository.save(project);
	}
}
