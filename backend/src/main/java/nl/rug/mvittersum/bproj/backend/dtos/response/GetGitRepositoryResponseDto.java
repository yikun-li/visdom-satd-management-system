package nl.rug.mvittersum.bproj.backend.dtos.response;

import lombok.Builder;
import lombok.Value;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitBranchDto;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitCommitDto;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitRepositoryDto;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitSnapshotDto;

@Value
@Builder
public class GetGitRepositoryResponseDto {
	GitRepositoryDto repository;
	GitBranchDto branch;
	GitCommitDto latestCommit;
	GitSnapshotDto latestSnapshot;
}
