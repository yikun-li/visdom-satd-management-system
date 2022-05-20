package nl.rug.mvittersum.bproj.backend.dtos.response;

import lombok.Builder;
import lombok.Value;
import nl.rug.mvittersum.bproj.analyser.dtos.AnalyserStatusDto;

@Value
@Builder
public class GetAnalyserStatusResponseDto {
	AnalyserStatus issues;
	AnalyserStatus comments;

	@Value
	@Builder
	public static class AnalyserStatus {
		Integer workLeft;
		AnalyserStatusDto.StatusCode status;
	}
}
