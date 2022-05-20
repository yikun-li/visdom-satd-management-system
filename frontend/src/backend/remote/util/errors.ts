import {IRestRequest} from "./request";
import {RestResponse} from "./response";

export class HttpError extends Error {
  constructor(readonly status: number) {
    super(`Response returned with status ${status}`);
  }
}

export class RequestFailedError extends Error {
  constructor(melding: string) {
    super(melding);
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ParallelRequestError extends Error {
  constructor(readonly requests: IRestRequest<any, any>[], readonly responses: RestResponse<any, any>[]) {
    super("An error occurred in one of the requests");
  }
}
