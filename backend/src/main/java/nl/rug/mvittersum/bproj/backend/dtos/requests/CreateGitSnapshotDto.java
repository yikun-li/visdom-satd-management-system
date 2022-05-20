package nl.rug.mvittersum.bproj.backend.dtos.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class CreateGitSnapshotDto {
	private String branch;
	private String from;
	private String to;
	private Integer createSnapshotEvery;
	private Integer createKeySnapshotEvery;
}
