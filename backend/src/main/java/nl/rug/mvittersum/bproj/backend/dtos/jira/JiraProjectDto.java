package nl.rug.mvittersum.bproj.backend.dtos.jira;

import lombok.Value;

@Value
public class JiraProjectDto {
	Long id;
	String name;
	String projectName;
	String key;
	String lastScanned;
}
