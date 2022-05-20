package nl.rug.mvittersum.bproj.backend.repositories.jdbc;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class GitCodeCommentJdbcRepository {
	private final NamedParameterJdbcTemplate template;

	public Map<Integer, Long> getCommentMap(Long branchId) {
		var map = new HashMap<Integer, Long>();
		var parameters = new MapSqlParameterSource("branchId", branchId);

		template.query("" +
						"SELECT gcc.content_hash, gcc.id\n" +
						"FROM git_code_comment gcc\n" +
						"LEFT JOIN git_file_comment gfc ON gcc.id = gfc.comment_id\n" +
						"LEFT JOIN git_file gf ON gf.id = gfc.file_id\n" +
						"LEFT JOIN git_snapshot_added_files gsaf ON gf.id = gsaf.added_files_id\n" +
						"LEFT JOIN git_snapshot gs ON gsaf.git_snapshot_id = gs.id\n" +
						"LEFT JOIN git_commit gc on gs.id = gc.snapshot_id\n" +
						"LEFT JOIN git_branch_commits gbc on gc.id = gbc.git_commit_id\n" +
						"WHERE gbc.git_branch_id = :branchId",
				parameters,
				commentMapCallback(map)
		);

		return map;
	}

	public Map<Integer, Long> getCommentMap(List<Long> fileIds) {
		var map = new HashMap<Integer, Long>();
		var parameters = new MapSqlParameterSource("fileIds", fileIds);

		template.query("" +
						"SELECT gcc.content_hash, gcc.id\n" +
						"FROM git_code_comment gcc\n" +
						"LEFT JOIN git_file_comment gfc ON gcc.id = gfc.comment_id\n" +
						"WHERE gfc.file_id IN (:fileIds)",
				parameters,
				commentMapCallback(map)
		);

		return map;
	}

	private RowCallbackHandler commentMapCallback(Map<Integer, Long> map) {
		return (rs) -> {
			do {
				map.put(rs.getInt("content_hash"), rs.getLong("id"));
			} while (rs.next());
		};
	}
}
