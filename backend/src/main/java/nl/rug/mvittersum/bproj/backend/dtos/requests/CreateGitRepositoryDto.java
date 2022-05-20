package nl.rug.mvittersum.bproj.backend.dtos.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class CreateGitRepositoryDto {
	private Long projectId;
	private String name;
	private String url;
	private Integer updateInterval;
}
