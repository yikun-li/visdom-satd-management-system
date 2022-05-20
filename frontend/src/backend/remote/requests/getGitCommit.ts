import {RestGitCommit} from "../../../types/git";
import {ENDPOINT_GIT_COMMIT} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function getGitCommit(commitId: number): RestRequest<RestGitCommit> {
  return RestRequest.get<RestGitCommit>(ENDPOINT_GIT_COMMIT)
    .urlParams({commitId})
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
