package nl.rug.mvittersum.bproj.backend.dtos.git;

import lombok.Value;
import nl.rug.mvittersum.bproj.backend.dtos.JobDto;

@Value
public class GitRepositoryDto {
	Long id;
	String name;
	String url;
	Boolean stored;
	String defaultBranch;
	String lastFetched;
}
