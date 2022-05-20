import {RestJob} from "../../../types/job";
import {ENDPOINT_GIT_REPOSITORY_SCAN} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function postGitRepositoryScan(repositoryId: number, branch: string): RestRequest<RestJob> {
  return RestRequest.post<RestJob>(ENDPOINT_GIT_REPOSITORY_SCAN)
    .urlParams({repositoryId})
    .json()
    .query({branch})
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
