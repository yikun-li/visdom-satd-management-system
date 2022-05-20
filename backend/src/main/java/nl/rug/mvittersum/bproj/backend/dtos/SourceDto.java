package nl.rug.mvittersum.bproj.backend.dtos;

import lombok.Value;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitRepositoryDto;
import nl.rug.mvittersum.bproj.backend.dtos.jira.JiraProjectDto;

@Value
public class SourceDto {
	SourceType type;
	GitRepositoryDto git;
	JiraProjectDto jira;

	public enum SourceType {
		GIT,
		JIRA
	}
}
