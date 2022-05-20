package nl.rug.mvittersum.bproj.backend.dtos.jira;

import lombok.Value;

@Value
public class JiraIssueDto {
	Long id;
	String key;
	String status;
	String resolution;
	String type;
	String updateDate;
	String creationDate;
	JiraClassifiableDto description;
	JiraClassifiableDto summary;
}
