package nl.rug.mvittersum.bproj.backend.mappers;

import com.atlassian.jira.rest.client.api.domain.BasicProject;
import nl.rug.mvittersum.bproj.backend.dtos.jira.JiraProjectDto;
import nl.rug.mvittersum.bproj.backend.dtos.requests.CreateJiraProjectDto;
import nl.rug.mvittersum.bproj.backend.entities.jira.JiraProject;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring", uses = {UtilMappers.class}, injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface JiraProjectMapper {

	@Mappings({
			@Mapping(target = "id", ignore = true),
			@Mapping(target = "project", ignore = true),
			@Mapping(target = "name", ignore = true),
			@Mapping(target = "url", ignore = true),
			@Mapping(target = "username", ignore = true),
			@Mapping(target = "password", ignore = true),
			@Mapping(target = "projectKey", source = "basicProject.key"),
			@Mapping(target = "projectName", source = "basicProject.name")
	})
	JiraProject fromBasicProject(BasicProject basicProject);

	@Mappings({
			@Mapping(target = "id", ignore = true),
			@Mapping(target = "project", ignore = true),
			@Mapping(target = "projectKey", source = "dto.key"),
			@Mapping(target = "projectName", ignore = true)
	})
	JiraProject fromCreateJiraProjectDto(CreateJiraProjectDto dto);

	@Mappings({
			@Mapping(target = "key", source = "project.projectKey")
	})
	JiraProjectDto toDto(JiraProject project);
}
