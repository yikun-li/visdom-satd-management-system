package nl.rug.mvittersum.bproj.backend.repositories.jdbc;

import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.data.GitFileScanStatistics;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
@RequiredArgsConstructor
public class GitFileJdbcRepository {
	private final NamedParameterJdbcTemplate template;

	public GitFileScanStatistics getFileScannedStatistics(Long branchId) {
		var stat = new GitFileScanStatistics();

		template.query(
				"SELECT COUNT(gf) AS amount, gf.scanned_for_comments AS scanned\n" +
						"FROM git_file gf\n" +
						"LEFT JOIN git_snapshot_added_files gsaf on gf.id = gsaf.added_files_id\n" +
						"LEFT JOIN git_snapshot gs on gsaf.git_snapshot_id = gs.id\n" +
						"LEFT JOIN git_commit gc on gs.id = gc.snapshot_id\n" +
						"LEFT JOIN git_branch_commits gbc on gc.id = gbc.git_commit_id\n" +
						"LEFT JOIN git_branch gb on gbc.git_branch_id = gb.id\n" +
						"WHERE gb.id = :branchId\n" +
						"GROUP BY gf.scanned_for_comments",
				new MapSqlParameterSource("branchId", branchId),
				(rs) -> {
					while (rs.next()) {
						if (rs.getBoolean("scanned")) {
							stat.setScanned(rs.getInt("amount"));
						} else {
							stat.setNotScanned(rs.getInt("amount"));
						}
					}
				}
		);

		return stat;
	}

	public List<Long> getFilesToScan(Long branchId) {
		var ids = new ArrayList<Long>();
		template.query(
				"SELECT gf.id\n" +
						"FROM git_file gf\n" +
						"LEFT JOIN git_snapshot_added_files gsaf on gf.id = gsaf.added_files_id\n" +
						"LEFT JOIN git_snapshot gs on gsaf.git_snapshot_id = gs.id\n" +
						"LEFT JOIN git_commit gc on gs.id = gc.snapshot_id\n" +
						"LEFT JOIN git_branch_commits gbc on gc.id = gbc.git_commit_id\n" +
						"LEFT JOIN git_branch gb on gbc.git_branch_id = gb.id\n" +
						"WHERE gb.id = :branchId AND gf.scanned_for_comments = false",
				new MapSqlParameterSource("branchId", branchId),
				rs -> {
					while (rs.next()) {
						ids.add(rs.getLong("id"));
					}
				}
		);
		return ids;
	}

	public Map<Long, Set<Long>> getSnapshotFileIds(List<Long> snapshotIds) {
		var idsMap = new HashMap<Long, Set<Long>>();
		var removedIdsMap = new HashMap<Long, Set<Long>>();

		template.query(
				"WITH RECURSIVE snap(id, parent_id, added_files_id, removed_files_id, base_id) AS (\n" +
						"    SELECT gs.id,\n" +
						"           gs.parent_id,\n" +
						"           gsaf.added_files_id,\n" +
						"           gsrf.removed_files_id,\n" +
						"           gs.id AS base_id\n" +
						"    FROM git_snapshot gs\n" +
						"             LEFT JOIN git_snapshot_added_files gsaf on gs.id = gsaf.git_snapshot_id\n" +
						"             LEFT JOIN git_snapshot_removed_files gsrf on gs.id = gsrf.git_snapshot_id\n" +
						"    WHERE gs.id IN (:snapshotIds)\n" +
						"    UNION\n" +
						"    SELECT gs.id,\n" +
						"           gs.parent_id,\n" +
						"           gsaf.added_files_id,\n" +
						"           gsrf.removed_files_id,\n" +
						"           child.base_id\n" +
						"    FROM snap child, git_snapshot gs\n" +
						"             LEFT JOIN git_snapshot parent ON parent.id = gs.parent_id\n" +
						"             LEFT JOIN git_snapshot_added_files gsaf on gs.id = gsaf.git_snapshot_id\n" +
						"             LEFT JOIN git_snapshot_removed_files gsrf on gs.id = gsrf.git_snapshot_id\n" +
						"    WHERE gs.id = child.parent_id\n" +
						")\n" +
						"SELECT base_id, added_files_id, removed_files_id FROM snap",
				new MapSqlParameterSource("snapshotIds", snapshotIds),
				(rs) -> {
					do {
						var id = rs.getLong("base_id");
						var ids = idsMap.computeIfAbsent(id, (key) -> new HashSet<>());
						var removedIds = removedIdsMap.computeIfAbsent(id, (key) -> new HashSet<>());
						var added = rs.getObject("added_files_id", Long.class);
						var removed = rs.getObject("removed_files_id", Long.class);
						if (added != null) ids.add(added);
						if (removed != null) removedIds.add(removed);
					} while (rs.next());
				}
		);

		removedIdsMap.forEach((key, value) -> idsMap.get(key).removeAll(value));

		return idsMap;
	}
}
