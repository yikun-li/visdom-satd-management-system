package nl.rug.mvittersum.bproj.backend.dtos.response;

import lombok.Builder;
import lombok.Value;
import nl.rug.mvittersum.bproj.backend.dtos.JobDto;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitBranchDto;

@Value
@Builder
public class StoreGitBranchResponseDto {
	GitBranchDto branch;
	JobDto storeJob;
}
