import {RestGitCommit} from "../../../types/git";
import {EMPTY_PAGE_QUERY, RestPage, RestPageQuery} from "../../../types/paging";
import {ENDPOINT_GIT_COMMITS} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function getGitCommits(
  repositoryId: number,
  paging: RestPageQuery = EMPTY_PAGE_QUERY,
  branch: string | null
): RestRequest<RestPage<RestGitCommit>, RestPage<RestGitCommit>> {
  return RestRequest.get<RestPage<RestGitCommit>, RestPage<RestGitCommit>>(ENDPOINT_GIT_COMMITS)
    .query({repositoryId, branch, ...paging})
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
