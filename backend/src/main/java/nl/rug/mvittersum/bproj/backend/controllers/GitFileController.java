package nl.rug.mvittersum.bproj.backend.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.dtos.git.GitFileDto;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.mappers.GitFileMapper;
import nl.rug.mvittersum.bproj.backend.services.git.GitFileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/git-files")
@RequiredArgsConstructor
@Slf4j
public class GitFileController {
	private final GitFileService gitFileService;
	private final GitFileMapper gitFileMapper;

	@GetMapping("/{fileId}")
	public GitFileDto getFile(@PathVariable("fileId") Long fileId) throws NotFoundException {
		var file = gitFileService.getFile(fileId);
		return gitFileMapper.toDto(file, file.getComments());
	}
}
