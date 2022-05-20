import {RestJob} from "../../../types/job";
import {ENDPOINT_GIT_REPOSITORY_SNAP} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

interface PostGitRepositorySnapBody {
  branch: string;
  from: string | null;
  to: string | null;
  createSnapshotEvery: number;
  createKeySnapshotEvery: number;
}

export function postGitRepositorySnap(repositoryId: number, body: PostGitRepositorySnapBody): RestRequest<RestJob> {
  return RestRequest.post<RestJob>(ENDPOINT_GIT_REPOSITORY_SNAP)
    .urlParams({repositoryId})
    .json(body)
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
