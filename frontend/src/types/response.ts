export interface RestRequestInfo {
  builder: string;
  vars: ReadonlyArray<any>;
}

export interface RestError {
  loading: false;
  success: false;
  code: number;
  message: string;
  request: RestRequestInfo;
}

export interface RestSuccess<T> {
  loading: false;
  success: true;
  payload: T;
  request: RestRequestInfo;
}

export interface RestNotLoaded {
  loading: true;
  request: RestRequestInfo;
}

export type RestServerResponse<T> = RestSuccess<T> | RestError | RestNotLoaded;
