import {ParallelRequestError} from "./errors";
import {IRestRequest} from "./request";
import {RestResponse} from "./response";
import {ExecFetch} from "./types";

type Mapper<A, B, C> = (requests: IRestRequest<A, B>[], responses: RestResponse<A, B>[]) => RestResponse<A, C>;
type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];

/**
 * <p>This will combine requests and fetch the data at the same time on execution.</p>
 */
export class ParallelRequests<RecvBody extends any[], MappedBody extends any[], CombinedBody = MappedBody>
  implements IRestRequest<RecvBody, CombinedBody> {
  private requests: IRestRequest<any, any>[] = [];
  private _responses: RestResponse<any, any>[] = [];
  private _response: RestResponse<RecvBody, CombinedBody> | null = null;

  get response(): RestResponse<RecvBody, CombinedBody> | null {
    return this._response;
  }

  async execute(fetcher: ExecFetch<RecvBody, CombinedBody>): Promise<RestResponse<RecvBody, CombinedBody>> {
    this._responses = await Promise.all(this.requests.map((request) => request.execute(fetcher)));
    return this.mapper(this.requests, this._responses);
  }

  map(mapper: Mapper<ArrayElement<RecvBody>, ArrayElement<MappedBody>, CombinedBody>): this {
    this.mapper = mapper;
    return this;
  }

  mapBody(mapper: (bodies: MappedBody) => CombinedBody): this {
    this.bodyMapper = mapper;
    return this;
  }

  add(request: IRestRequest<any, any>): this {
    this.requests.push(request);
    return this;
  }

  private bodyMapper: (bodies: MappedBody) => CombinedBody = (bodies) => (bodies as unknown) as CombinedBody;

  private mapper: Mapper<ArrayElement<RecvBody>, ArrayElement<MappedBody>, CombinedBody> = (requests, responses) => {
    return responses.every((response) => response.success)
      ? {
          success: true,
          body: this.bodyMapper(responses.map((response) => response.body) as MappedBody),
          originalBody: responses.map((response) => response.originalBody) as RecvBody,
          response: responses[0].response
        }
      : {
          success: false,
          body: null,
          error: new ParallelRequestError(requests, responses),
          originalBody: responses.map((response) => response.originalBody) as RecvBody,
          response: responses[0].response
        };
  };

  static create<RecvBody extends any[], MappedBody extends any[], CombinedBody>(
    requests: IRestRequest<any, any>[]
  ): ParallelRequests<RecvBody, MappedBody, CombinedBody> {
    return requests.reduce((all, curr) => all.add(curr), new ParallelRequests<RecvBody, MappedBody, CombinedBody>());
  }
}
