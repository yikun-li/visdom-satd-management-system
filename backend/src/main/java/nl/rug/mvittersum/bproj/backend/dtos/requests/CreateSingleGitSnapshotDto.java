package nl.rug.mvittersum.bproj.backend.dtos.requests;

import lombok.Data;

@Data
public class CreateSingleGitSnapshotDto {
	private Long parentId;
}
