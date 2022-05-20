import {GetServerSideProps} from "next";
import {ParsedUrlQuery} from "querystring";
import {RestServerResponse} from "../../types/response";
import {RestRequestBuilder} from "../remote/util/types";
import {ServerSidePropsContext} from "./context";
import {ServerSideRequest} from "./request";

type RestBody<T> = T extends RestServerResponse<infer S> ? S : never;

export class ServerSideProps<Props, Query extends ParsedUrlQuery = ParsedUrlQuery> {
  private requests: Map<keyof Props, ServerSideRequest<Props, Query, any, any>> = new Map();
  private toPropsFn: ((context: ServerSidePropsContext<Props, Query>) => Props) | null = null;
  private toPropFns: [keyof Props, (context: ServerSidePropsContext<Props, Query>) => any][] = [];

  request<Key extends keyof Props, Body extends RestBody<Props[Key]>, Vars extends any[]>(
    key: Key,
    builder: RestRequestBuilder<Vars, any, Body>,
    vars: (context: ServerSidePropsContext<Props, Query>) => Readonly<Vars>,
    condition?: (context: ServerSidePropsContext<Props, Query>) => boolean
  ): this {
    this.requests.set(key, new ServerSideRequest(builder, vars, condition));
    return this;
  }

  prop<K extends keyof Props>(key: K, toPropFn: (context: ServerSidePropsContext<Props, Query>) => Props[K]): this {
    this.toPropFns.push([key, toPropFn]);
    return this;
  }

  toProps(fn: (context: ServerSidePropsContext<Props, Query>) => Props): this {
    this.toPropsFn = fn;
    return this;
  }

  private async buildRequests(
    context: ServerSidePropsContext<Props, Query>
  ): Promise<Map<keyof Props, RestServerResponse<unknown>>> {
    return new Map(
      await Promise.all(
        [...this.requests.entries()].map(async ([key, request]) => [key, await request.getResponse(context)] as const)
      )
    );
  }

  build(): GetServerSideProps<Props, Query> {
    return async (next) => {
      try {
        const context = new ServerSidePropsContext(next, this.buildRequests.bind(this));
        await context.init();
        return {props: this.toPropsFn ? this.toPropsFn(context) : context.defaultProps(this.toPropFns)};
      } catch (e) {
        console.error("Error getting props", e);
        return {notFound: true};
      }
    };
  }

  static builder<Props, Query extends ParsedUrlQuery = ParsedUrlQuery>(): ServerSideProps<Props, Query> {
    return new ServerSideProps<Props, Query>();
  }
}
