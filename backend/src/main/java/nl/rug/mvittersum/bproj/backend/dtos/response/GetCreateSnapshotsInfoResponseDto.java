package nl.rug.mvittersum.bproj.backend.dtos.response;

import lombok.Builder;
import lombok.Value;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitCommitDto;

@Value
@Builder
public class GetCreateSnapshotsInfoResponseDto {
	Integer availableCommits;
	GitCommitDto lastSnappedCommit;
}
