package nl.rug.mvittersum.bproj.backend.data;

import lombok.Data;

@Data
public class GitFileScanStatistics {
	private Integer scanned;
	private Integer notScanned;
}
