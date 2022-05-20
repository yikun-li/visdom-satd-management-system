import {RestGitBranchStatisticsResponse} from "../../../types/git";
import {ENDPOINT_GIT_REPOSITORY_STATISTICS} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function getGitRepositoryStatistics(
  repositoryId: number,
  branch: string | null,
  from: string,
  to: string,
  interval: number
): RestRequest<RestGitBranchStatisticsResponse> {
  return RestRequest.get<RestGitBranchStatisticsResponse>(ENDPOINT_GIT_REPOSITORY_STATISTICS)
    .urlParams({repositoryId})
    .query({branch, from, to, interval})
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
