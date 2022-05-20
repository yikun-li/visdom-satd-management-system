import {IRestRequest} from "./util/request";
import {RestError, RestResponse, RestSuccessResponse} from "./util/response";
import {RequestMethod} from "./util/types";

function requestMethodString(type: RequestMethod): string {
  return String(RequestMethod[type]).toUpperCase();
}

function getQueryString(query: Record<string, any>): string {
  const entries = query ? Object.entries(query).filter(([, value]) => Boolean(value)) : [];
  return entries.length === 0
    ? ""
    : "?" + entries.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
}

export class RequestManager {
  constructor(private baseUrl: string) {}

  async execute<RecvBody, MappedBody>(
    request: IRestRequest<RecvBody, MappedBody>
  ): Promise<RestResponse<RecvBody, MappedBody>> {
    return await request.execute(async ({method, url, query, headers, body}) => {
      console.log(`${method} ${this.getRequestUrl(url, query)}`);
      return fetch(this.getRequestUrl(url, query), {
        method: requestMethodString(method),
        credentials: "include",
        headers,
        body
      });
    });
  }

  async executeAndThrow<RecvBody, MappedBody>(
    request: IRestRequest<RecvBody, MappedBody>
  ): Promise<RestSuccessResponse<RecvBody, MappedBody>> {
    const response = await this.execute(request);
    if (!response.success) {
      throw new RestError(response);
    }
    return response;
  }

  private getRequestUrl(endpointUrl: string, query: Record<string, any>): string {
    return `${this.baseUrl}${endpointUrl}${getQueryString(query)}`;
  }
}
