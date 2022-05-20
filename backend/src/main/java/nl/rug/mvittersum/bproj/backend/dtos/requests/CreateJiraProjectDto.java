package nl.rug.mvittersum.bproj.backend.dtos.requests;

import lombok.Data;

@Data
public class CreateJiraProjectDto {
	private Long projectId;
	private String name;
	private String url;
	private String username;
	private String password;
	private String key;
}
