import {RestGitFile} from "../../../types/git";
import {ENDPOINT_GIT_FILE} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function getGitFile(fileId: number): RestRequest<RestGitFile> {
  return RestRequest.get<RestGitFile>(ENDPOINT_GIT_FILE)
    .urlParams({fileId})
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
