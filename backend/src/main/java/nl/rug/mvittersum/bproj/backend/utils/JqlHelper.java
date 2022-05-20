package nl.rug.mvittersum.bproj.backend.utils;

import lombok.experimental.UtilityClass;
import nl.rug.mvittersum.bproj.backend.entities.jira.JiraProject;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@UtilityClass
public class JqlHelper {
	private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")
			.withZone(ZoneId.systemDefault());

	public static String getByProject(JiraProject project) {
		return "project = " + project.getProjectKey();
	}

	public static String getByProjectUpdatedAfter(JiraProject project, Instant after) {
		return getByProject(project) + " and updatedDate > '" + DATE_TIME_FORMATTER.format(after) + "'";
	}
}
