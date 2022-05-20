package nl.rug.mvittersum.bproj.backend.dtos.git;

import lombok.Value;
import nl.rug.mvittersum.bproj.backend.data.GitCommentStatistics;

import java.util.List;

@Value
public class GitSnapshotDto {
	Long id;
	List<Long> commitIds;
	GitCommentStatistics statistics;
}
