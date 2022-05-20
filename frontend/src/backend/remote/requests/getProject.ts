import {RestProject} from "../../../types/project";
import {ENDPOINT_PROJECT} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function getProject(projectId: number): RestRequest<RestProject, RestProject> {
  return RestRequest.get<RestProject, RestProject>(ENDPOINT_PROJECT)
    .urlParams({projectId})
    .json()
    .validateRequest(async (response) => {
      validateResponseOk(response);
    })
    .build();
}
