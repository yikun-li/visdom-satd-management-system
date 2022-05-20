import {RestJob} from "../../../types/job";
import {ENDPOINT_GIT_REPOSITORY_FETCH} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function postGitRepositoryFetch(repositoryId: number): RestRequest<RestJob> {
  return RestRequest.post<RestJob>(ENDPOINT_GIT_REPOSITORY_FETCH)
    .urlParams({repositoryId})
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
