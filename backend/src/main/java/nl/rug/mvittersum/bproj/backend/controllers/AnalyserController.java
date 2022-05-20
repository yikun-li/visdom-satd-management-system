package nl.rug.mvittersum.bproj.backend.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.dtos.requests.StartAnalyserDto;
import nl.rug.mvittersum.bproj.backend.dtos.response.GetAnalyserStatusResponseDto;
import nl.rug.mvittersum.bproj.backend.services.AnalyserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analyser")
@RequiredArgsConstructor
@Slf4j
public class AnalyserController {
	private final AnalyserService analyserService;

	@GetMapping
	public GetAnalyserStatusResponseDto getAnalyserStatus() {
		var workLeft = analyserService.getWorkLeft();
		var comments = analyserService.getCommentStatus();
		var issues = analyserService.getIssueStatus();

		return GetAnalyserStatusResponseDto.builder()
				.comments(GetAnalyserStatusResponseDto.AnalyserStatus.builder()
						.workLeft(workLeft.getFirst())
						.status(comments.getStatus())
						.build()
				)
				.issues(GetAnalyserStatusResponseDto.AnalyserStatus.builder()
						.workLeft(workLeft.getSecond())
						.status(issues.getStatus())
						.build()
				)
				.build();
	}

	@PostMapping
	public GetAnalyserStatusResponseDto startAnalyser(@RequestBody StartAnalyserDto body) {
		if (body.isComments()) {
			analyserService.startCommentAnalyser();
		}
		if (body.isIssues()) {
			analyserService.startIssueAnalyser();
		}

		return getAnalyserStatus();
	}
}
