import {RestGetGitRepositoryResponse} from "../../../types/git";
import {ENDPOINT_GIT_REPOSITORY} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function getGitRepository(
  repositoryId: number,
  branch: string | null
): RestRequest<RestGetGitRepositoryResponse> {
  return RestRequest.get<RestGetGitRepositoryResponse>(ENDPOINT_GIT_REPOSITORY)
    .urlParams({repositoryId})
    .query({branch})
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
