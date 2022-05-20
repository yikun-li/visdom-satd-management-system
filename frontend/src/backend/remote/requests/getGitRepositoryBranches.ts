import {RestGitBranch} from "../../../types/git";
import {ENDPOINT_GIT_REPOSITORY_BRANCHES} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function getGitRepositoryBranches(repositoryId: number): RestRequest<RestGitBranch[], RestGitBranch[]> {
  return RestRequest.get<RestGitBranch[], RestGitBranch[]>(ENDPOINT_GIT_REPOSITORY_BRANCHES)
    .urlParams({repositoryId})
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
