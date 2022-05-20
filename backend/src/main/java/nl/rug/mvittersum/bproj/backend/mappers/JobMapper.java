package nl.rug.mvittersum.bproj.backend.mappers;

import nl.rug.mvittersum.bproj.backend.dtos.JobDto;
import nl.rug.mvittersum.bproj.backend.jobs.Job;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring", uses = {UtilMappers.class})
public interface JobMapper {
	@Mappings({
			@Mapping(target = "runningTime", expression = "java(job.getRunningTime())"),
			@Mapping(target = "next", source = "nextId")
	})
	JobDto toDto(Job<?> job);
}
