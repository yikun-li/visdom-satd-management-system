package nl.rug.mvittersum.bproj.backend.dtos;

import lombok.Value;

import java.util.List;

@Value
public class ProjectDto {
	Long id;
	String name;
	List<SourceDto> sources;
	Integer jira;
	Integer git;
	String created;
	String lastUpdated;
}
