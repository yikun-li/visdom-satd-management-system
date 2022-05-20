package nl.rug.mvittersum.bproj.backend.mappers;

import nl.rug.mvittersum.bproj.backend.data.GitDirectory;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitDirectoryDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GitDirectoryMapper {
	GitDirectoryDto toDto(GitDirectory directory);
}
