package nl.rug.mvittersum.bproj.backend.repositories.jdbc;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class GitRepositoryJdbcRepository {
	private final JdbcTemplate template;
	private final Clock clock;

	public List<Long> getRepositoriesToUpdate() {
		var list = new ArrayList<Long>();
		var now = Date.from(Instant.now(clock));

		template.query("SELECT gr.id " +
						"FROM git_repository gr " +
						"WHERE gr.last_fetched IS NULL " +
						"OR (gr.update_interval IS NOT NULL AND gr.last_fetched + (interval '1' second) * gr.update_interval < ?)",
				(rs) -> {
					while (rs.next()) list.add(rs.getLong("id"));
				},
				now
		);

		return list;
	}
}
