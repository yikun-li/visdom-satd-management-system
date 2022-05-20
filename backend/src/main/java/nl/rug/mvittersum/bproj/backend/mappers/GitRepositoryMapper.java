package nl.rug.mvittersum.bproj.backend.mappers;

import nl.rug.mvittersum.bproj.backend.dtos.git.GitRepositoryDto;
import nl.rug.mvittersum.bproj.backend.dtos.requests.CreateGitRepositoryDto;
import nl.rug.mvittersum.bproj.backend.entities.git.GitBranch;
import nl.rug.mvittersum.bproj.backend.entities.git.GitRepository;
import nl.rug.mvittersum.bproj.backend.jobs.Job;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring", uses = {UtilMappers.class}, injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface GitRepositoryMapper {
	default GitRepositoryDto toDto(GitRepository repository) {
		return toDto(repository, null);
	}

	@Mappings({
			@Mapping(target = "id", source = "repository.id"),
			@Mapping(target = "name", source = "repository.name"),
			@Mapping(target = "stored", source = "stored"),
			@Mapping(target = "lastFetched", source = "repository.lastFetched")
	})
	GitRepositoryDto toDto(GitRepository repository, Boolean stored);

	@Mappings({
			@Mapping(target = "id", ignore = true),
			@Mapping(target = "project", ignore = true),
			@Mapping(target = "snapshots", ignore = true),
			@Mapping(target = "branches", ignore = true),
			@Mapping(target = "defaultBranch", ignore = true),
			@Mapping(target = "lastFetched", ignore = true)
	})
	GitRepository fromCreateRequest(CreateGitRepositoryDto dto);
}
