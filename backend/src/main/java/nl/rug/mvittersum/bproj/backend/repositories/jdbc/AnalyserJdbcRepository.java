package nl.rug.mvittersum.bproj.backend.repositories.jdbc;

import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.utils.Tuples;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AnalyserJdbcRepository {
	private final JdbcTemplate template;

	public Tuples.Double<Integer, Integer> getWorkLeft() {
		return template.query(
				"SELECT (\n" +
						"           SELECT COUNT(gcc) FROM git_code_comment gcc WHERE gcc.debt_type = 'NOT_ANALYSED'\n" +
						"       ) AS comments,\n" +
						"       (\n" +
						"           SELECT COUNT(jc) FROM jira_classifiable jc WHERE jc.debt_type = 'NOT_ANALYSED'\n" +
						"       ) AS issues;",
				(rse) -> {
					if (!rse.next()) throw new RuntimeException("Query failed");
					return new Tuples.Double<>(rse.getInt("comments"), rse.getInt("issues"));
				}
		);
	}
}
