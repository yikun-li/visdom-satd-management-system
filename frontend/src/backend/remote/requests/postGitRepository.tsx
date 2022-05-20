import {RestCreateGitRepositoryResponse} from "../../../types/git";
import {ENDPOINT_GIT_REPOSITORIES} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export interface PostGitRepositoryBody {
  projectId: number;
  url: string;
  name: string;
}

export function postGitRepository(body: PostGitRepositoryBody): RestRequest<RestCreateGitRepositoryResponse> {
  return RestRequest.post<RestCreateGitRepositoryResponse>(ENDPOINT_GIT_REPOSITORIES)
    .json(body)
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
