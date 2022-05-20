import {GetServerSidePropsContext} from "next";
import {ParsedUrlQuery} from "querystring";
import {RestPageQuery} from "../../types/paging";
import {RestServerResponse} from "../../types/response";

function binder<T>(object: T, methods: (keyof T)[]): void {
  methods.forEach((method) => (object[method] = (object[method] as any).bind(object)));
}

export class ServerSidePropsContext<Props, Query extends ParsedUrlQuery = ParsedUrlQuery> {
  private responses: Map<keyof Props, RestServerResponse<unknown>> = new Map();
  private readonly createReqs: Promise<any>;

  constructor(
    public readonly next: GetServerSidePropsContext<Query>,
    createRequests: (
      context: ServerSidePropsContext<Props, Query>
    ) => Promise<Map<keyof Props, RestServerResponse<unknown>>>
  ) {
    binder(this, ["response", "queryValue", "pathValue", "pathId", "queryStr"]);
    this.createReqs = (async () => (this.responses = new Map(await createRequests(this))))();
  }

  async init(): Promise<void> {
    await this.createReqs;
  }

  queryValue<T>(key: string, validate: (val: any) => void): T {
    const val = this.next.query[key];
    validate(val);
    return val as unknown as T;
  }

  pathValue<T>(key: keyof Query, validate: (val: any) => void): T {
    const val = this.params[key];
    validate(val);
    return val as unknown as T;
  }

  pathId(key: keyof Query): number {
    return Number(
      this.pathValue(key, (val) => {
        const num = Number(val);
        if (val === undefined || num !== num) throw new Error("Invalid value for key " + key);
      })
    );
  }

  queryStr(key: string): string | undefined {
    return this.queryValue<string | undefined>(key, (val) => {
      if (!(typeof val === "string" || typeof val === "undefined")) throw new Error("Invalid value for key " + key);
    });
  }

  response<Body>(key: keyof Props): RestServerResponse<Body> {
    const res = this.responses.get(key);
    if (!res) throw new Error("Invalid key for response " + key);
    return res as RestServerResponse<Body>;
  }

  get query(): ParsedUrlQuery {
    return this.next.query;
  }

  get isServerRequest(): boolean {
    return !this.next.req?.url?.startsWith("/_next") ?? true;
  }

  get params(): Query {
    return this.next.params || ({} as Query);
  }

  get paging(): RestPageQuery {
    const page = this.queryStr("page");
    const size = this.queryStr("size");

    return {
      page: Number(page) || null,
      size: Number(size) || null,
      sort: this.queryStr("sort") || null
    };
  }

  defaultProps(mappers: [keyof Props, (context: ServerSidePropsContext<Props, Query>) => any][]): Props {
    return {
      ...Object.fromEntries(this.responses.entries()),
      ...Object.fromEntries(mappers.map(([key, fn]) => [key, fn(this)]))
    } as Props;
  }
}
