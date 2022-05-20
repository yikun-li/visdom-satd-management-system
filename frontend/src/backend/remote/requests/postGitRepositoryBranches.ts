import {RestStoreBranchResponse} from "../../../types/git";
import {ENDPOINT_GIT_REPOSITORY_BRANCHES} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function postGitRepositoryBranches(repositoryId: number, branch: string): RestRequest<RestStoreBranchResponse> {
  return RestRequest.post<RestStoreBranchResponse>(ENDPOINT_GIT_REPOSITORY_BRANCHES)
    .urlParams({repositoryId})
    .json({branch})
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
