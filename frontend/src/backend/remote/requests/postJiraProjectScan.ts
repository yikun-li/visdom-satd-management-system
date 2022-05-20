import {RestJob} from "../../../types/job";
import {ENDPOINT_JIRA_PROJECT_SCAN} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function postJiraProjectScan(jiraProjectId: number): RestRequest<RestJob> {
  return RestRequest.post<RestJob>(ENDPOINT_JIRA_PROJECT_SCAN)
    .urlParams({jiraProjectId})
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
