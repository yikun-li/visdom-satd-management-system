package nl.rug.mvittersum.bproj.backend.mappers;

import nl.rug.mvittersum.bproj.backend.dtos.git.GitSnapshotDto;
import nl.rug.mvittersum.bproj.backend.entities.git.GitSnapshot;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GitSnapshotMapper {
	GitSnapshotDto toDto(GitSnapshot snapshot, List<Long> commitIds);

	List<GitSnapshotDto> toDto(List<GitSnapshot> snapshot);
}
