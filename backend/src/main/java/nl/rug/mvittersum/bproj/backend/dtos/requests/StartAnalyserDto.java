package nl.rug.mvittersum.bproj.backend.dtos.requests;

import lombok.Data;

@Data
public class StartAnalyserDto {
	private boolean comments;
	private boolean issues;
}
