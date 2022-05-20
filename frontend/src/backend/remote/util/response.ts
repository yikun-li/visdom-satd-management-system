interface IRestResponse<RecvBody, MappedBody> {
  success: boolean;
  originalBody: RecvBody;
  response: Response;
  body: MappedBody;
}

export interface RestErrorResponse<RecvBody> extends IRestResponse<RecvBody, null> {
  success: false;
  body: null;
  error: Error;
}

export interface RestSuccessResponse<RecvBody, MappedBody> extends IRestResponse<RecvBody, MappedBody> {
  success: true;
}

export type RestResponse<RecvBody, MappedBody> =
  | RestErrorResponse<RecvBody>
  | RestSuccessResponse<RecvBody, MappedBody>;

export class RestError<RecvBody> extends Error {
  readonly cause: Error;

  constructor(readonly response: RestErrorResponse<RecvBody>) {
    super(response.error.message);
    this.cause = response.error;
  }
}
