package nl.rug.mvittersum.bproj.backend.controllers;

import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.dtos.JobDto;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.jobs.Job;
import nl.rug.mvittersum.bproj.backend.mappers.JobMapper;
import nl.rug.mvittersum.bproj.backend.services.JobService;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobsController {
	private final JobService jobService;
	private final JobMapper jobMapper;

	@GetMapping("/{jobId}")
	public HttpEntity<JobDto> getJobInfo(@PathVariable("jobId") String id) throws NotFoundException {
		UUID uuid = UUID.fromString(id);
		Job<?> job = jobService.findJob(uuid).orElseThrow(NotFoundException::new);
		return ResponseEntity.ok(jobMapper.toDto(job));
	}
}
