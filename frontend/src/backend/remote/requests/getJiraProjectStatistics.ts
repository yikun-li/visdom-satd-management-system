import {RestJiraProjectStatistics} from "../../../types/jira";
import {ENDPOINT_JIRA_PROJECT_STATISTICS} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function getJiraProjectStatistics(jiraProjectId: number): RestRequest<RestJiraProjectStatistics> {
  return RestRequest.get<RestJiraProjectStatistics>(ENDPOINT_JIRA_PROJECT_STATISTICS)
    .urlParams({jiraProjectId})
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
