import {RestJiraIssue} from "../../../types/jira";
import {EMPTY_PAGE_QUERY, RestPage, RestPageQuery} from "../../../types/paging";
import {ENDPOINT_JIRA_ISSUES} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function getJiraIssues(
  jiraProjectId: number,
  paging: RestPageQuery = EMPTY_PAGE_QUERY
): RestRequest<RestPage<RestJiraIssue>> {
  return RestRequest.get<RestPage<RestJiraIssue>>(ENDPOINT_JIRA_ISSUES)
    .query({projectId: jiraProjectId, ...paging})
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
