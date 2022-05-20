package nl.rug.mvittersum.bproj.backend.repositories.jdbc;

import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.data.DebtStatistics;
import nl.rug.mvittersum.bproj.backend.data.JiraProjectStatistics;
import nl.rug.mvittersum.bproj.satd.DebtType;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class JiraStatisticsJdbcRepository {
	private final NamedParameterJdbcTemplate template;

	private static void fillStatistics(JiraProjectStatistics statistics, String issueType, String issueStatus, DebtType summary, DebtType description) {
		fillStatistic(statistics.getInSummary(), summary);
		if (description != null) fillStatistic(statistics.getInDescription(), description);

		var debt = (description != null && description.isDebt()) ? description : summary;

		fillStatistic(
				statistics.getPerIssueType().computeIfAbsent(issueType, (key) -> new DebtStatistics()),
				debt
		);
		fillStatistic(
				statistics.getPerStatus().computeIfAbsent(issueStatus, (key) -> new DebtStatistics()),
				debt
		);
	}

	private static void fillStatistic(DebtStatistics statistic, DebtType debtType) {
		statistic.setAmount(statistic.getAmount() + 1);
		if (!DebtType.NOT_DEBT.equals(debtType) && !DebtType.NOT_ANALYSED.equals(debtType)) {
			statistic.setDebt(statistic.getDebt() + 1);
		}
		statistic.getPerType().put(debtType, statistic.getPerType().computeIfAbsent(debtType, (key) -> 0) + 1);
	}

	public Map<Long, JiraProjectStatistics> getProjectStatistics(List<Long> projectIds) {
		if (projectIds.isEmpty()) return Collections.emptyMap();
		var params = new MapSqlParameterSource("projectIds", projectIds);
		var map = new HashMap<Long, JiraProjectStatistics>();

		template.query(
				"SELECT jp.id        AS project_id,\n" +
						"       ji.type,\n" +
						"       ji.status,\n" +
						"       js.debt_type AS summary_debt_type,\n" +
						"       jd.debt_type AS description_debt_type\n" +
						"FROM jira_issue ji\n" +
						"         INNER JOIN jira_project jp ON jp.id = ji.project_id\n" +
						"         LEFT JOIN jira_classifiable jd on jd.id = ji.description_id\n" +
						"         LEFT JOIN jira_classifiable js on js.id = ji.description_id\n" +
						"WHERE jp.id IN (:projectIds);\n",
				params,
				(rs) -> {
					do {
						var projectId = rs.getLong("project_id");
						var issueType = rs.getString("type");
						var issueStatus = rs.getString("status");
						var summaryDebtType = rs.getObject("summary_debt_type", String.class);
						var descriptionDebtType = rs.getObject("description_debt_type", String.class);

						if (summaryDebtType == null) continue;

						fillStatistics(
								map.computeIfAbsent(projectId, (key) -> new JiraProjectStatistics()),
								issueType,
								issueStatus,
								DebtType.valueOf(summaryDebtType),
								descriptionDebtType == null ? null : DebtType.valueOf(descriptionDebtType)
						);
					} while (rs.next());
				}
		);

		return map;
	}
}
