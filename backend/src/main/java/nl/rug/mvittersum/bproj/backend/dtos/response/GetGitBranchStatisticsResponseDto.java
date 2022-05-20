package nl.rug.mvittersum.bproj.backend.dtos.response;

import lombok.Builder;
import lombok.Value;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitCommitDto;

import java.util.List;

@Value
@Builder
public class GetGitBranchStatisticsResponseDto {
	String branchName;
	String from;
	String to;
	Integer interval;
	List<GitCommitWithStatisticsDto> data;
}
