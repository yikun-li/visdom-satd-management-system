package nl.rug.mvittersum.bproj.backend.repositories.jdbc;

import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.entities.git.GitCommit;
import nl.rug.mvittersum.bproj.backend.utils.Tuples;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class GitCommitJdbcRepository {
	private final NamedParameterJdbcTemplate template;

	public Map<String, GitCommit> getCommitHashMap(Long repositoryId) {
		var map = new HashMap<String, GitCommit>();

		template.query(
				"SELECT gc.id, gc.hash\n" +
						"FROM git_commit gc \n" +
						"LEFT JOIN git_branch_commits gbc on gc.id = gbc.git_commit_id\n" +
						"LEFT JOIN git_branch gb on gb.id = gbc.git_branch_id\n" +
						"WHERE gb.repository_id = :repositoryId",
				new MapSqlParameterSource("repositoryId", repositoryId),
				(rs) -> {
					do {
						var hash = rs.getString("hash");
						var commit = GitCommit.builder().id(rs.getLong("id")).hash(hash).build();
						map.put(hash, commit);
					} while (rs.next());
				}
		);

		return map;
	}

	public Map<Long, Tuples.Double<Integer, Integer>> getTotalCommitsInBranch(Collection<Long> branchIds) {
		if(branchIds.isEmpty()) return Map.of();

		var map = new HashMap<Long, Tuples.Double<Integer, Integer>>();

		template.query(
				"SELECT COUNT(gc) AS total, COUNT(gc) FILTER (where snapshot_id IS NOT NULL) AS snapped, gbc.git_branch_id\n" +
						"FROM git_commit gc \n" +
						"    INNER JOIN git_branch_commits gbc ON gc.id = gbc.git_commit_id \n" +
						"WHERE gbc.git_branch_id IN (:branchIds)\n" +
						"GROUP BY gbc.git_branch_id\n",
				new MapSqlParameterSource("branchIds", branchIds),
				(rs) -> {
					do {
						map.put(
								rs.getLong("git_branch_id"),
								new Tuples.Double<>(rs.getInt("total"), rs.getInt("snapped"))
						);
					} while (rs.next());
				}
		);

		return map;
	}
}
