package nl.rug.mvittersum.bproj.backend.mappers;

import nl.rug.mvittersum.bproj.backend.data.GitCommentStatistics;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitCommitDto;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitDirectoryDto;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitFileDto;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitFilesResultDto;
import nl.rug.mvittersum.bproj.backend.dtos.response.GitCommitWithStatisticsDto;
import nl.rug.mvittersum.bproj.backend.entities.git.GitCommit;
import nl.rug.mvittersum.bproj.backend.entities.git.GitSnapshot;
import org.eclipse.jgit.revwalk.RevCommit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring", uses = {GitSnapshotMapper.class, UtilMappers.class})
public interface GitCommitMapper {
	@Mappings({
			@Mapping(target = "hash", expression = "java(commit.getId().getName())"),
			@Mapping(target = "commitDate", source = "commit.commitTime"),
			@Mapping(target = "shortMessage", source = "commit.shortMessage"),
			@Mapping(target = "fullMessage", source = "commit.fullMessage"),
			@Mapping(target = "id", ignore = true),
			@Mapping(target = "children", ignore = true),
			@Mapping(target = "snapshot", ignore = true),
			@Mapping(target = "branches", ignore = true),
			@Mapping(target = "parent", ignore = true)
	})
	GitCommit fromRevCommit(RevCommit commit);

	@Mappings({
			@Mapping(target = "date", source = "commit.commitDate"),
			@Mapping(target = "snapped", source = "commit.snapshot")
	})
	GitCommitDto toDto(GitCommit commit);

	@Mappings({
			@Mapping(target = "commit", source = "commit"),
			@Mapping(target = "statistics", source = "statistics")
	})
	GitCommitWithStatisticsDto toStatisticsDto(GitCommit commit, GitCommentStatistics statistics);

	@Mappings({
			@Mapping(target = "path", source = "path"),
			@Mapping(target = "files", source = "files"),
			@Mapping(target = "directories", source = "directories")
	})
	GitFilesResultDto toFilesResultDto(String path, List<GitFileDto> files, List<GitDirectoryDto> directories);

	default Boolean isSnapped(GitSnapshot snapshot) {
		return snapshot != null;
	}
}
