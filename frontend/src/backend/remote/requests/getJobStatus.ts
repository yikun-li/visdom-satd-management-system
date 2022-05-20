import {RestJob} from "../../../types/job";
import {ENDPOINT_JOB} from "../endpoints";
import {RestRequest} from "../util/request";
import {validateResponseOk} from "../util/validators";

export function getJobStatus(jobId: string): RestRequest<RestJob, RestJob> {
  return RestRequest.get<RestJob, RestJob>(ENDPOINT_JOB)
    .urlParams({jobId})
    .json()
    .validateRequest((response) => {
      validateResponseOk(response);
    })
    .build();
}
