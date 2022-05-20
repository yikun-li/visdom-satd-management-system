package nl.rug.mvittersum.bproj.backend.services.jira;

import com.atlassian.jira.rest.client.api.AuthenticationHandler;
import com.atlassian.jira.rest.client.api.JiraRestClient;
import com.atlassian.jira.rest.client.api.SearchRestClient;
import com.atlassian.jira.rest.client.api.domain.Issue;
import com.atlassian.jira.rest.client.internal.async.AsynchronousJiraRestClientFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.entities.jira.JiraProject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
@Slf4j
public class JiraRequestService {

	@Value("${app.jira.search-batch-size}")
	private Integer searchBatchSize;

	public JiraRestClient getClient(String url, AuthenticationHandler auth) {
		var factory = new AsynchronousJiraRestClientFactory();
		var uri = URI.create(url);
		return factory.create(uri, auth);

	}

	public JiraRestClient getClient(JiraProject jiraProject) {
		return getClient(jiraProject.getUrl(), jiraProject.getAuthenticationHandler());
	}

	private boolean searchIssuePage(SearchRestClient client, List<Set<Issue>> pages, String jql, int from, Set<String> fields) {
		log.info("Executing JQL (max {}, from {}) {}", searchBatchSize, from, jql);
		var result = client.searchJql(jql, searchBatchSize, from, fields).claim();
		var content = StreamSupport.stream(result.getIssues().spliterator(), false).collect(Collectors.toSet());
		log.info("Received batch (startIndex={}, maxResults={}, total={}, pageSize={})",
				result.getStartIndex(), result.getMaxResults(), result.getTotal(), content.size());
		pages.add(content);
		return result.getTotal() > (result.getStartIndex() + result.getMaxResults());
	}

	public Set<Issue> searchIssues(JiraProject jiraProject, String jql, Set<String> fields) {
		var pages = new ArrayList<Set<Issue>>();
		var client = getClient(jiraProject).getSearchClient();
		var i = 0;

		while (searchIssuePage(client, pages, jql, i, fields)) i += searchBatchSize;

		return pages.stream().flatMap(Collection::stream).collect(Collectors.toSet());
	}
}
