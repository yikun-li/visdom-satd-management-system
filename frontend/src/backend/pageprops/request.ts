import {ParsedUrlQuery} from "querystring";
import {RestRequestInfo, RestServerResponse} from "../../types/response";
import {RequestManager} from "../remote/manager";
import * as requests from "../remote/requests";
import {RestRequestBuilder} from "../remote/util/types";
import {ServerSidePropsContext} from "./context";

const SsrRequestManager = new RequestManager(`${process.env.BACKEND_HOST}/rest`);

function getRequestBuilderName(fn: RestRequestBuilder<any, any, any>): string {
  const req = Object.entries(requests).find(([, value]) => fn === value);
  if (req) return req[0];
  throw new Error("Invalid request function");
}

export class ServerSideRequest<Props, Query extends ParsedUrlQuery, Vars extends any[], Body> {
  constructor(
    public readonly builder: RestRequestBuilder<Vars, any, Body>,
    public readonly getVars: (context: ServerSidePropsContext<Props, Query>) => Readonly<Vars>,
    public readonly condition?: (context: ServerSidePropsContext<Props, Query>) => boolean
  ) {}

  async getResponse(context: ServerSidePropsContext<Props, Query>): Promise<RestServerResponse<Body>> {
    const vars = this.getVars(context);
    const request: RestRequestInfo = {vars, builder: getRequestBuilderName(this.builder)};

    if (!context.isServerRequest || (this.condition && !this.condition(context))) {
      return {loading: true, request};
    }

    const response = await SsrRequestManager.execute(await this.builder(...vars));

    return response.success
      ? {loading: false, success: true, request, payload: response.body}
      : {loading: false, success: false, request, code: response.response.status, message: response.error.message};
  }
}
