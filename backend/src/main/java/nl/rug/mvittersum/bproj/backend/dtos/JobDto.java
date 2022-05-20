package nl.rug.mvittersum.bproj.backend.dtos;

import lombok.Value;
import nl.rug.mvittersum.bproj.backend.jobs.Job;
import nl.rug.mvittersum.bproj.backend.jobs.JobType;

@Value
public class JobDto {
	String id;
	Job.JobState state;
	long runningTime;
	String next;
	JobType type;
	String start;
}
