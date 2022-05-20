package nl.rug.mvittersum.bproj.backend.dtos.git;

import lombok.Value;
import nl.rug.mvittersum.bproj.backend.dtos.JobDto;

@Value
public class GitBranchDto {
	Long id;
	String name;
	Integer totalCommits;
	Integer totalSnapped;
}
