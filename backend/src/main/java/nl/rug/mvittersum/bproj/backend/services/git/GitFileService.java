package nl.rug.mvittersum.bproj.backend.services.git;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.entities.git.GitFile;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import nl.rug.mvittersum.bproj.backend.repositories.jdbc.GitFileJdbcRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.GitFileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class GitFileService {
	private final GitFileRepository gitFileRepository;
	private final GitFileJdbcRepository gitFileJdbcRepository;

	@Transactional(readOnly = true)
	public GitFile getFile(Long fileId) throws NotFoundException {
		return gitFileRepository.findByIdWithComments(fileId).orElseThrow(NotFoundException::new);
	}

	@Transactional
	public List<GitFile> getSnapshotFiles(Long snapshotId) {
		return gitFileRepository.findByIdIn(gitFileJdbcRepository.getSnapshotFileIds(List.of(snapshotId)).get(snapshotId));
	}

	@Transactional
	public Map<String, Collection<GitFile>> getSnapshotFileMap(Long snapshotId) {
		var files = gitFileRepository.findAllByIdIn(gitFileJdbcRepository.getSnapshotFileIds(List.of(snapshotId)).get(snapshotId));
		var map = new HashMap<String, Collection<GitFile>>();
		files.forEach(file -> map.computeIfAbsent(file.getPath(), (path) -> new ArrayList<>()).add(file));
		return map;
	}
}
