package nl.rug.mvittersum.bproj.analyser.dtos;

import lombok.Data;

@Data
public class AnalyserStatusDto {
	private StatusCode status;

	public enum StatusCode {
		RUNNING,
		IDLING
	}
}
