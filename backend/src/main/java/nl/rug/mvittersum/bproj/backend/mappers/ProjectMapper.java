package nl.rug.mvittersum.bproj.backend.mappers;

import nl.rug.mvittersum.bproj.backend.dtos.ProjectDto;
import nl.rug.mvittersum.bproj.backend.dtos.SourceDto;
import nl.rug.mvittersum.bproj.backend.dtos.requests.CreateProjectDto;
import nl.rug.mvittersum.bproj.backend.entities.Project;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.Date;
import java.util.List;

@Mapper(componentModel = "spring", uses = {UtilMappers.class})
public interface ProjectMapper {
	@Mappings({
			@Mapping(target = "sources", ignore = true),
			@Mapping(target = "jira", source = "project.amountOfSources.first"),
			@Mapping(target = "git", source = "project.amountOfSources.second")
	})
	ProjectDto toDto(Project project);

	@Mappings({
			@Mapping(target = "id"),
			@Mapping(target = "name"),
			@Mapping(target = "sources", source = "sources"),
			@Mapping(target = "jira", ignore = true),
			@Mapping(target = "git", ignore = true)
	})
	ProjectDto toDto(Project project, List<SourceDto> sources);

	@Mappings({
			@Mapping(target = "id", ignore = true),
			@Mapping(target = "gitRepositories", ignore = true),
			@Mapping(target = "jiraProjects", ignore = true),
			@Mapping(target = "created", source = "created"),
			@Mapping(target = "lastUpdated", source = "created")
	})
	Project fromCreateProjectDto(CreateProjectDto dto, Date created);

	List<ProjectDto> toDto(List<Project> projects);
}
