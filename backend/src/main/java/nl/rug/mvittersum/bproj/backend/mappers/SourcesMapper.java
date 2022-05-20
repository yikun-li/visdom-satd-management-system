package nl.rug.mvittersum.bproj.backend.mappers;

import nl.rug.mvittersum.bproj.backend.dtos.SourceDto;
import nl.rug.mvittersum.bproj.backend.entities.git.GitRepository;
import nl.rug.mvittersum.bproj.backend.entities.jira.JiraProject;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, uses = {GitRepositoryMapper.class})
public interface SourcesMapper {

	@Mappings({
			@Mapping(target = "type", expression = "java(SourceDto.SourceType.GIT)"),
			@Mapping(target = "git", source = "repository"),
			@Mapping(target = "jira", ignore = true)
	})
	SourceDto toDto(GitRepository repository);

	@Mappings({
			@Mapping(target = "type", expression = "java(SourceDto.SourceType.JIRA)"),
			@Mapping(target = "git", ignore = true),
			@Mapping(target = "jira", source = "jiraProject")
	})
	SourceDto toDto(JiraProject jiraProject);
}
