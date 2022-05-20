package nl.rug.mvittersum.bproj.backend.dtos.git;

import lombok.Value;
import nl.rug.mvittersum.bproj.backend.data.GitCommentStatistics;

@Value
public class GitDirectoryDto {
	String name;
	String path;
	GitCommentStatistics statistics;
}
