import {RestGitFiles} from "../../../types/git";
import {ENDPOINT_GIT_COMMIT_FILES} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function getGitCommitFiles(commitId: number, dir?: string): RestRequest<RestGitFiles> {
  return RestRequest.get<RestGitFiles>(ENDPOINT_GIT_COMMIT_FILES)
    .urlParams({commitId})
    .query({dir})
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
