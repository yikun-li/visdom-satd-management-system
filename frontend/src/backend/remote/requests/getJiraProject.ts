import {RestJiraProject} from "../../../types/jira";
import {ENDPOINT_JIRA_PROJECT} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function getJiraProject(jiraProjectId: number): RestRequest<RestJiraProject> {
  return RestRequest.get<RestJiraProject>(ENDPOINT_JIRA_PROJECT)
    .urlParams({jiraProjectId})
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
