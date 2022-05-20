import {RestJiraProject} from "../../../types/jira";
import {ENDPOINT_JIRA_PROJECTS} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function getJiraProjects(url: string, user: string | null, pass: string | null): RestRequest<RestJiraProject[]> {
  return RestRequest.get<RestJiraProject[]>(ENDPOINT_JIRA_PROJECTS)
    .query({url, user, pass})
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
