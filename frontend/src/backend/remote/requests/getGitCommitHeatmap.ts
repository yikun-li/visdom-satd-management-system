import {DebtType} from "../../../types/debt";
import {RestHeatmap} from "../../../types/heatmap";
import {ENDPOINT_GIT_COMMIT_HEATMAP} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export enum GitSnapshotHeatmapMode {
  ALL_COMMENTS,
  ALL_DEBT,
  DEBT_TYPE
}

export function getGitCommitHeatmap(
  commitId: number,
  mode: GitSnapshotHeatmapMode,
  debtType: DebtType | null
): RestRequest<RestHeatmap> {
  return RestRequest.get<RestHeatmap>(ENDPOINT_GIT_COMMIT_HEATMAP)
    .urlParams({commitId})
    .query({
      mode: GitSnapshotHeatmapMode[mode],
      debtType: GitSnapshotHeatmapMode.DEBT_TYPE ? DebtType[debtType!] : null
    })
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
