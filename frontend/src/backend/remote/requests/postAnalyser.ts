import {ENDPOINT_ANALYSER} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";
import {GetAnalyserResponse} from "./getAnalyser";

export interface PostAnalyserBody {
  comments: boolean;
  issues: boolean;
}

export function postAnalyser(body: PostAnalyserBody): RestRequest<GetAnalyserResponse> {
  return RestRequest.post<GetAnalyserResponse>(ENDPOINT_ANALYSER)
    .json(body)
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
