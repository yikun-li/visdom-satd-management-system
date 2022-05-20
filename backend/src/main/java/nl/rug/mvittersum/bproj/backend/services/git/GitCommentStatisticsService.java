package nl.rug.mvittersum.bproj.backend.services.git;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.data.GitCommentStatistics;
import nl.rug.mvittersum.bproj.backend.data.GitDirectory;
import nl.rug.mvittersum.bproj.backend.entities.git.GitFile;
import nl.rug.mvittersum.bproj.backend.repositories.jdbc.GitFileJdbcRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jdbc.GitStatisticsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class GitCommentStatisticsService {
	private final GitStatisticsRepository gitStatisticsRepository;
	private final GitFileJdbcRepository gitFileJdbcRepository;

	@Transactional(readOnly = true)
	public Map<Long, GitCommentStatistics> getStatistics(List<Long> commitIds) {
		var deltas = gitStatisticsRepository.fetchDeltaForCommits(commitIds);
		findParents(deltas);

		var parentMap = new HashMap<Long, Set<Long>>();
		var queue = new ArrayDeque<Long>();
		deltas.forEach((key, value) -> {
			if (value.getParentId() == null) {
				queue.add(key);
			} else {
				parentMap.computeIfAbsent(value.getParentId(), (k) -> new HashSet<>()).add(key);
			}
		});

		return toCommitIdMap(deltas.values(), processDeltas(queue, deltas, parentMap));
	}

	@Transactional(readOnly = true)
	public void loadDirectoryStatistics(Collection<GitDirectory> directories) {
		var fileIds = directories.stream()
				.flatMap(directory -> directory.getFiles().stream().map(GitFile::getId))
				.collect(Collectors.toList());
		var statistics = gitStatisticsRepository.fetchForFiles(fileIds);
		directories.forEach(directory -> {
			directory.getFiles().forEach(file -> file.setStatistics(statistics.containsKey(file.getId()) ? statistics.get(file.getId()) : new GitCommentStatistics()));
			directory.setStatistics(GitCommentStatistics.combine(
					directory.getFiles().stream().map(GitFile::getStatistics).collect(Collectors.toList())
			));
		});
	}

	private void findParents(Map<Long, GitCommentStatistics.Delta> deltas) {
		var missingParentIds = deltas.values().stream()
				.map(GitCommentStatistics.Delta::getParentId)
				.filter(k -> !deltas.containsKey(k))
				.collect(Collectors.toList());
		if (missingParentIds.isEmpty()) return;
		var parentFileMap = gitFileJdbcRepository.getSnapshotFileIds(missingParentIds);
		var missingFileIds = parentFileMap.values().stream().flatMap(Collection::stream).collect(Collectors.toList());
		if (missingFileIds.isEmpty()) return;
		var stats = gitStatisticsRepository.fetchForFiles(missingFileIds);
		parentFileMap.forEach((key, value) -> {
			var delta = new GitCommentStatistics.Delta();
			delta.setSnapshotId(key);
			delta.setAdded(GitCommentStatistics.combine(
					value.stream()
							.filter(stats::containsKey)
							.map(stats::get)
							.collect(Collectors.toList())
			));
			deltas.put(key, delta);
		});
	}

	private Map<Long, GitCommentStatistics> toCommitIdMap(Collection<GitCommentStatistics.Delta> deltas, Map<Long, GitCommentStatistics> snapshotIdMap) {
		return deltas.stream()
				.filter(delta -> delta.getCommitId() != null)
				.collect(Collectors.toMap(
						GitCommentStatistics.Delta::getCommitId,
						(delta) -> snapshotIdMap.get(delta.getSnapshotId())
				));
	}

	private Map<Long, GitCommentStatistics> processDeltas(Queue<Long> queue, Map<Long, GitCommentStatistics.Delta> deltas, Map<Long, Set<Long>> parentMap) {
		var map = new HashMap<Long, GitCommentStatistics>();
		while (!queue.isEmpty()) {
			var snapshotId = queue.remove();
			var delta = deltas.get(snapshotId);

			if (delta.getParentId() == null) {
				map.put(snapshotId, delta.getAdded());
			} else {
				map.put(snapshotId, GitCommentStatistics.combine(List.of(
						map.get(delta.getParentId()),
						delta.getAdded(),
						delta.getRemoved().negative()
				)));
			}

			if (parentMap.containsKey(snapshotId)) {
				queue.addAll(parentMap.get(snapshotId));
			}
		}
		return map;
	}
}
