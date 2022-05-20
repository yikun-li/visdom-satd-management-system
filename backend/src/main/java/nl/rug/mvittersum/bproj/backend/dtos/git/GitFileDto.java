package nl.rug.mvittersum.bproj.backend.dtos.git;

import lombok.Value;
import nl.rug.mvittersum.bproj.backend.data.GitCommentStatistics;

import java.util.Set;

@Value
public class GitFileDto {
	Long id;
	String path;
	String filename;
	Boolean scannedForComments;

	String content;
	Set<GitFileCommentDto> comments;
	GitCommentStatistics statistics;
}
