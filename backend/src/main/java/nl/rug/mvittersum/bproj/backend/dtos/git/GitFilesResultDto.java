package nl.rug.mvittersum.bproj.backend.dtos.git;

import lombok.Value;

import java.util.List;

@Value
public class GitFilesResultDto {
	String path;
	List<GitDirectoryDto> directories;
	List<GitFileDto> files;
}
