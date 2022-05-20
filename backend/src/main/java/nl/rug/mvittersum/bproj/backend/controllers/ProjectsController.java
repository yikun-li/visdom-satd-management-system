package nl.rug.mvittersum.bproj.backend.controllers;

import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.dtos.ProjectDto;
import nl.rug.mvittersum.bproj.backend.dtos.requests.CreateProjectDto;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.mappers.ProjectMapper;
import nl.rug.mvittersum.bproj.backend.services.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectsController {
	private final ProjectService projectService;
	private final ProjectMapper projectMapper;
	private final Clock clock;

	@GetMapping
	public List<ProjectDto> getAllProjects() {
		return projectService.getAll()
				.stream()
				.map(projectMapper::toDto)
				.collect(Collectors.toList());
	}

	@GetMapping("/{id}")
	public ProjectDto getProject(@PathVariable("id") Long id) throws NotFoundException {
		return projectMapper.toDto(projectService.get(id), projectService.getSources(id));
	}

	@PostMapping
	public ProjectDto createProject(@RequestBody CreateProjectDto body) {
		var project = projectMapper.fromCreateProjectDto(body, Date.from(Instant.now(clock)));
		return projectMapper.toDto(projectService.createProject(project));
	}
}
