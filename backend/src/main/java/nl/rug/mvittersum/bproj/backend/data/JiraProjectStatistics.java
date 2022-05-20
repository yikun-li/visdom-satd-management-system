package nl.rug.mvittersum.bproj.backend.data;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class JiraProjectStatistics {
	private Map<String, DebtStatistics> perIssueType = new HashMap<>();
	private Map<String, DebtStatistics> perStatus = new HashMap<>();
	private DebtStatistics inSummary = new DebtStatistics();
	private DebtStatistics inDescription = new DebtStatistics();
}
