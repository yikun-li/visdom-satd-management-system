package nl.rug.mvittersum.bproj.backend.dtos.jira;

import lombok.Value;
import nl.rug.mvittersum.bproj.backend.data.KeywordsMap;
import nl.rug.mvittersum.bproj.satd.DebtType;

@Value
public class JiraClassifiableDto {
	String content;
	DebtType debtType;
	Long debtProbability;
	KeywordsMap keywords;
}
