package nl.rug.mvittersum.bproj.backend.dtos.response;

import lombok.Builder;
import lombok.Value;
import nl.rug.mvittersum.bproj.backend.dtos.JobDto;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitRepositoryDto;

@Value
@Builder
public class CreateGitRepositoryResponseDto {
	GitRepositoryDto repository;
	JobDto cloneJob;
}
