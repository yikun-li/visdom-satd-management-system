import {IRestRequest} from "./request";

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
export type ReqBody = RequestInit["body"];
export type ResponseValidator<RecvBody> = (response: Response, body: RecvBody) => Promise<void> | void;
export type ResponseBodyLoader<RecvBody> = (response: Response) => Promise<RecvBody>;
export type ResponseBodyMapper<RecvBody, MappedBody> = (body: RecvBody) => Promise<MappedBody>;
export type ExecFetch<RecvBody, MappedBody> = (options: RestRequestOptions<RecvBody, MappedBody>) => Promise<Response>;

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

export interface RestRequestOptions<RecvBody, MappedBody> {
  method: RequestMethod;
  url: string;
  query: Record<string, any>;
  body: ReqBody;
  headers: Record<string, string>;
  validate: ResponseValidator<RecvBody>;
  loadBody: ResponseBodyLoader<RecvBody>;
  map: ResponseBodyMapper<RecvBody, MappedBody>;
  noTryRefreshJwt?: true;
}

export type RestRequestBuilder<Vars extends any[], RecvBody, MappedBody = RecvBody> = (
  ...vars: Vars
) => IRestRequest<RecvBody, MappedBody> | Promise<IRestRequest<RecvBody, MappedBody>>;
