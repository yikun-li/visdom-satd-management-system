package nl.rug.mvittersum.bproj.backend.mappers;

import nl.rug.mvittersum.bproj.backend.dtos.git.GitFileDto;
import nl.rug.mvittersum.bproj.backend.entities.git.GitFile;
import nl.rug.mvittersum.bproj.backend.entities.git.GitFileComment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.Set;

@Mapper(componentModel = "spring", uses = {GitCodeCommentMapper.class})
public interface GitFileMapper {
	@Mapping(target = "comments", ignore = true)
	GitFileDto toDto(GitFile file);

	@Mappings({
			@Mapping(target = "comments", ignore = true),
			@Mapping(target = "content", ignore = true)
	})
	GitFileDto toSimpleDto(GitFile file);

	@Mapping(target = "comments", source = "comments")
	GitFileDto toDto(GitFile file, Set<GitFileComment> comments);
}
