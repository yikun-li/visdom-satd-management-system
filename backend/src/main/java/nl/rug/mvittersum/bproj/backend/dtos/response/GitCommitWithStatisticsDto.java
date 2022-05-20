package nl.rug.mvittersum.bproj.backend.dtos.response;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import nl.rug.mvittersum.bproj.backend.data.GitCommentStatistics;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitCommitDto;

@Value
@Builder
@RequiredArgsConstructor
public class GitCommitWithStatisticsDto {
	GitCommitDto commit;
	GitCommentStatistics statistics;
}
