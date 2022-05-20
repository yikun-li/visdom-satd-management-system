package nl.rug.mvittersum.bproj.backend.mappers;

import com.atlassian.jira.rest.client.api.domain.Comment;
import nl.rug.mvittersum.bproj.backend.entities.jira.JiraIssueComment;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Mapper(componentModel = "spring", uses = {UtilMappers.class, JiraClassifiableMapper.class}, injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface JiraIssueCommentMapper {
	@Mappings({
			@Mapping(target = "id", ignore = true),
			@Mapping(target = "content", source = "comment.body"),
			@Mapping(target = "author", source = "comment.author.displayName"),
			@Mapping(target = "creationDate", source = "comment.creationDate")
	})
	JiraIssueComment fromApiComment(Comment comment);

	default Set<JiraIssueComment> mapIterable(Iterable<Comment> comments) {
		return StreamSupport.stream(comments.spliterator(), false)
				.map(this::fromApiComment)
				.collect(Collectors.toSet());
	}
}
