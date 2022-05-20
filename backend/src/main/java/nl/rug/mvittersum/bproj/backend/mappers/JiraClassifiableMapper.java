package nl.rug.mvittersum.bproj.backend.mappers;

import nl.rug.mvittersum.bproj.backend.dtos.jira.JiraClassifiableDto;
import nl.rug.mvittersum.bproj.backend.entities.jira.JiraClassifiable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface JiraClassifiableMapper {
	@Mappings({
			@Mapping(target = "id", ignore = true),
			@Mapping(target = "content", source = "content")
	})
	JiraClassifiable fromString(String content);

	JiraClassifiableDto toDto(JiraClassifiable classifiable);
}
