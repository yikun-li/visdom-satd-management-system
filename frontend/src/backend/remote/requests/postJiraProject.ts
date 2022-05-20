import {RestJiraProject} from "../../../types/jira";
import {ENDPOINT_JIRA_PROJECTS} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

interface PostJiraProjectBody {
  projectId: number;
  name: string;
  url: string;
  username: string | null;
  password: string | null;
  key: string;
}

export function postJiraProject(body: PostJiraProjectBody): RestRequest<RestJiraProject> {
  return RestRequest.post<RestJiraProject>(ENDPOINT_JIRA_PROJECTS)
    .json(body)
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
