package nl.rug.mvittersum.bproj.backend.dtos.git;

import lombok.Value;

@Value
public class GitCommitDto {
	Long id;
	String hash;
	String date;
	String shortMessage;
	String fullMessage;
	Boolean snapped;
}
