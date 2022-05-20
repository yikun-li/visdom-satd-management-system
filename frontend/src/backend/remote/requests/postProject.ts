import {RestProject} from "../../../types/project";
import {ENDPOINT_PROJECTS} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export interface PostProjectBody {
  name: string;
}

export function postProject(body: PostProjectBody): RestRequest<RestProject> {
  return RestRequest.post<RestProject>(ENDPOINT_PROJECTS)
    .json(body)
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
