package nl.rug.mvittersum.bproj.backend.repositories.jdbc;

import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.data.DebtStatistics;
import nl.rug.mvittersum.bproj.backend.data.GitCommentStatistics;
import nl.rug.mvittersum.bproj.commentparser.Comment;
import nl.rug.mvittersum.bproj.satd.DebtType;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class GitStatisticsRepository {
	private final NamedParameterJdbcTemplate template;

	public Map<Long, GitCommentStatistics.Delta> fetchDeltaForCommits(List<Long> commitIds) {
		if(commitIds.isEmpty()) return Collections.emptyMap();
		var map = new HashMap<Long, GitCommentStatistics.Delta>();

		template.query(
				"SELECT gc.id                 AS commit_id,\n" +
						"       gs.id                 AS snapshot_id,\n" +
						"       gs.parent_id          AS snapshot_parent_id,\n" +
						"       gcc_added.type        AS added_type,\n" +
						"       gcc_added.debt_type   AS added_debt_type,\n" +
						"       COUNT(gcc_added)      AS added_amount,\n" +
						"       gcc_removed.type      AS removed_type,\n" +
						"       gcc_removed.debt_type AS removed_debt_type,\n" +
						"       COUNT(gcc_removed)    AS removed_amount\n" +
						"FROM git_commit gc\n" +
						"         LEFT JOIN git_snapshot gs ON gs.id = gc.snapshot_id\n" +
						"         LEFT JOIN git_snapshot_added_files gsaf ON gs.id = gsaf.git_snapshot_id\n" +
						"         LEFT JOIN git_file gf_added ON gsaf.added_files_id = gf_added.id\n" +
						"         LEFT JOIN git_file_comment gfc_added ON gf_added.id = gfc_added.file_id\n" +
						"         LEFT JOIN git_code_comment gcc_added ON gfc_added.comment_id = gcc_added.id\n" +
						"         LEFT JOIN git_snapshot_removed_files gsrf ON gs.id = gsrf.git_snapshot_id\n" +
						"         LEFT JOIN git_file gf_removed ON gsrf.removed_files_id = gf_removed.id\n" +
						"         LEFT JOIN git_file_comment gfc_removed ON gf_removed.id = gfc_removed.file_id\n" +
						"         LEFT JOIN git_code_comment gcc_removed ON gfc_removed.comment_id = gcc_removed.id\n" +
						"WHERE gc.id IN (:commitIds)\n" +
						"GROUP BY gc.id, gs.id, gs.parent_id, gcc_added.type, gcc_added.debt_type, " +
						"gcc_removed.type, gcc_removed.debt_type",
				new MapSqlParameterSource("commitIds", commitIds),
				(rs) -> {
					do {
						var commitId = rs.getLong("commit_id");
						var snapshotId = rs.getLong("snapshot_id");
						var parentId = rs.getObject("snapshot_parent_id", Long.class);
						var delta = map.computeIfAbsent(snapshotId, (key) -> new GitCommentStatistics.Delta());
						delta.setCommitId(commitId);
						delta.setParentId(parentId);
						delta.setSnapshotId(snapshotId);
						fillDeltaStatistics(delta.getAdded(), rs, "added");
						fillDeltaStatistics(delta.getRemoved(), rs, "removed");
					} while (rs.next());
				}
		);

		return map;
	}

	public Map<Long, GitCommentStatistics> fetchForFiles(List<Long> fileIds) {
		if(fileIds.isEmpty()) return Collections.emptyMap();
		var map = new HashMap<Long, GitCommentStatistics>();

		template.query(
				"SELECT gf.id, gcc.type, gcc.debt_type, COUNT(gcc) AS amount\n" +
						"FROM git_file gf\n" +
						"         INNER JOIN git_file_comment gfc on gf.id = gfc.file_id\n" +
						"         INNER JOIN git_code_comment gcc on gcc.id = gfc.comment_id\n" +
						"WHERE gf.id IN (:fileIds)\n" +
						"GROUP BY gcc.type, gf.id, gcc.debt_type",
				new MapSqlParameterSource("fileIds", fileIds),
				(rs) -> {
					do {
						var fileId = rs.getLong("id");
						var type = rs.getString("type");
						var debtType = rs.getString("debt_type");
						var amount = rs.getInt("amount");
						var statistics = map.computeIfAbsent(fileId, (k) -> new GitCommentStatistics());
						fillStatistics(statistics, Comment.CommentType.valueOf(type), DebtType.valueOf(debtType), amount);
					} while(rs.next());
				}
		);

		return map;
	}

	private void fillDeltaStatistics(GitCommentStatistics statistics, ResultSet rs, String prefix) throws SQLException {
		fillStatistics(
				statistics,
				rs.getObject(prefix + "_type", String.class),
				rs.getObject(prefix + "_debt_type", String.class),
				rs.getInt(prefix + "_amount")
		);
	}

	private void fillStatistics(GitCommentStatistics statistics, String type, String debtType, Integer amount) {
		if (amount > 0 && type != null && debtType != null) {
			fillStatistics(statistics, Comment.CommentType.valueOf(type), DebtType.valueOf(debtType), amount);
		}
	}

	private void fillStatistics(GitCommentStatistics statistics, Comment.CommentType type, DebtType debtType, Integer amount) {
		fillStatistic(statistics.getTotal(), debtType, amount);
		fillStatistic(statistics.getPerType().computeIfAbsent(type, (key) -> new DebtStatistics()), debtType, amount);
	}

	private void fillStatistic(DebtStatistics statistic, DebtType debtType, int amount) {
		statistic.setAmount(statistic.getAmount() + amount);
		if (!DebtType.NOT_DEBT.equals(debtType) && !DebtType.NOT_ANALYSED.equals(debtType)) {
			statistic.setDebt(statistic.getDebt() + amount);
		}
		statistic.getPerType().put(debtType, statistic.getPerType().computeIfAbsent(debtType, (key) -> 0) + amount);
	}

}
