package nl.rug.mvittersum.bproj.backend.mappers;


import nl.rug.mvittersum.bproj.backend.dtos.git.GitBranchDto;
import nl.rug.mvittersum.bproj.backend.entities.git.GitBranch;
import nl.rug.mvittersum.bproj.backend.entities.git.GitCommit;
import nl.rug.mvittersum.bproj.backend.jobs.Job;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface GitBranchMapper {
	GitBranchDto toDto(GitBranch branch);

	@Mappings({
			@Mapping(target = "id", ignore = true),
			@Mapping(target = "commits", ignore = true),
			@Mapping(target = "repository", ignore = true)
	})
	GitBranch fromRemoteName(String name);
}
