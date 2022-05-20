package nl.rug.mvittersum.bproj.backend.mappers;

import nl.rug.mvittersum.bproj.backend.dtos.git.GitFileCommentDto;
import nl.rug.mvittersum.bproj.backend.entities.git.GitCodeComment;
import nl.rug.mvittersum.bproj.backend.entities.git.GitFileComment;
import nl.rug.mvittersum.bproj.commentparser.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface GitCodeCommentMapper {
	@Mappings({
			@Mapping(target = "id", ignore = true),
			@Mapping(target = "files", ignore = true),
			@Mapping(target = "content", source = "comment.content"),
			@Mapping(target = "contentHash", expression = "java(comment.getContent().hashCode())"),
			@Mapping(target = "type", source = "comment.type"),
			@Mapping(target = "debtType", ignore = true),
			@Mapping(target = "debtProbability", ignore = true)
	})
	GitCodeComment fromNewComment(Comment comment);

	@Mappings({
			@Mapping(target = "content", source = "comment.comment.content"),
			@Mapping(target = "debtType", source = "comment.comment.debtType"),
			@Mapping(target = "debtProbability", source = "comment.comment.debtProbability"),
			@Mapping(target = "type", source = "comment.comment.type"),
			@Mapping(target = "id", source = "comment.comment.id"),
			@Mapping(target = "keywords", source = "comment.comment.keywords")
	})
	GitFileCommentDto toDto(GitFileComment comment);
}
