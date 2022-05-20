import {RestProject} from "../../../types/project";
import {ENDPOINT_PROJECTS} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function getProjects(): RestRequest<RestProject[]> {
  return RestRequest.get<RestProject[]>(ENDPOINT_PROJECTS)
    .json()
    .validateRequest(async (response) => {
      validateResponseOk(response);
    })
    .build();
}
