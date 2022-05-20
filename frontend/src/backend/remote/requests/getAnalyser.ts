import {RestAnalyserStatus} from "../../../types/analyser";
import {ENDPOINT_ANALYSER} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export interface GetAnalyserResponse {
  comments: RestAnalyserStatus;
  issues: RestAnalyserStatus;
}

export function getAnalyser(): RestRequest<GetAnalyserResponse> {
  return RestRequest.get<GetAnalyserResponse>(ENDPOINT_ANALYSER)
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
