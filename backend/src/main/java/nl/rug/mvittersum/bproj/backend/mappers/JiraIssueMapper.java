package nl.rug.mvittersum.bproj.backend.mappers;

import com.atlassian.jira.rest.client.api.domain.Issue;
import nl.rug.mvittersum.bproj.backend.dtos.jira.JiraIssueDto;
import nl.rug.mvittersum.bproj.backend.entities.jira.JiraIssue;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {UtilMappers.class, JiraIssueCommentMapper.class, JiraClassifiableMapper.class}, injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface JiraIssueMapper {
	@Mappings({
			@Mapping(target = "id", ignore = true),
			@Mapping(target = "project", ignore = true),
			@Mapping(target = "key", source = "issue.key"),
			@Mapping(target = "type", source = "issue.issueType.name"),
			@Mapping(target = "resolution", source = "issue.resolution.description"),
			@Mapping(target = "status", source = "issue.status.name"),
			@Mapping(target = "comments", source = "issue.comments"),
	})
	JiraIssue fromApiIssue(Issue issue);

	JiraIssue updateIssue(JiraIssue newDetails, @MappingTarget JiraIssue issue);

	JiraIssueDto toDto(JiraIssue issue);
}
