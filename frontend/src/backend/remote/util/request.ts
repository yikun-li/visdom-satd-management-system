import {RestResponse} from "./response";
import {
  ExecFetch,
  ReqBody,
  RequestMethod,
  ResponseBodyLoader,
  ResponseBodyMapper,
  ResponseValidator,
  RestRequestOptions
} from "./types";

export interface IRestRequest<RecvBody, MappedBody = RecvBody> {
  response: RestResponse<RecvBody, MappedBody> | null;
  noTryRefreshJwt?: boolean;

  execute(fetcher: ExecFetch<RecvBody, MappedBody>): Promise<RestResponse<RecvBody, MappedBody>>;
}

/**
 * <p>A class for a 'description' about a REST request. The description of the request is found in the
 * <code>options</code> property.</p>
 * <p>This class is constructable, but it is recommended to create a
 * <code>RestRequest</code>-instance with the <code>RestRequestBuilder</code>, using the static methods on this
 * class.</p>
 */
export class RestRequest<RecvBody, MappedBody = RecvBody> implements IRestRequest<RecvBody, MappedBody> {
  constructor(private options: RestRequestOptions<RecvBody, MappedBody>) {}

  private _response: RestResponse<RecvBody, MappedBody> | null = null;

  get response(): RestResponse<RecvBody, MappedBody> | null {
    return this._response;
  }

  get noTryRefreshJwt(): boolean {
    return this.options.noTryRefreshJwt === true;
  }

  async execute(fetcher: ExecFetch<RecvBody, MappedBody>): Promise<RestResponse<RecvBody, MappedBody>> {
    const response = await fetcher(this.options);
    const recvBody = await this.options.loadBody(response);

    try {
      await this.options.validate(response, recvBody);
      const body = await this.options.map(recvBody);
      this._response = {
        success: true,
        body,
        originalBody: recvBody,
        response
      };
    } catch (error) {
      this._response = {
        success: false,
        body: null,
        originalBody: recvBody,
        error,
        response
      };
    }

    return this._response;
  }

  static get<RecvBody, MappedBody = RecvBody>(url: string): RequestBuilder<RecvBody, MappedBody> {
    return new RequestBuilder<RecvBody, MappedBody>(RequestMethod.GET, url);
  }

  static post<RecvBody, MappedBody = RecvBody>(url: string): RequestBuilder<RecvBody, MappedBody> {
    return new RequestBuilder<RecvBody, MappedBody>(RequestMethod.POST, url);
  }

  static put<RecvBody, MappedBody = RecvBody>(url: string): RequestBuilder<RecvBody, MappedBody> {
    return new RequestBuilder<RecvBody, MappedBody>(RequestMethod.PUT, url);
  }

  static delete<RecvBody, MappedBody = RecvBody>(url: string): RequestBuilder<RecvBody, MappedBody> {
    return new RequestBuilder<RecvBody, MappedBody>(RequestMethod.DELETE, url);
  }
}

/**
 * <p>A builder for the <code>RestRequest</code> class. Can be created using the static methods on main class.</p>
 */
class RequestBuilder<RecvBody, MappedBody> {
  private _query: Record<string, any>;
  private _body: ReqBody;
  private _headers: Record<string, any> = {};
  private _resValidate: ResponseValidator<RecvBody>;
  private _bodyLoader: ResponseBodyLoader<RecvBody>;
  private _bodyMap: ResponseBodyMapper<RecvBody, MappedBody> = (a) => a as any;
  private _noTryRefreshJwt?: true;

  constructor(private type: RequestMethod, private url: string) {}

  /**
   * <p>Sets the URL parameters of the endpoints location.</p>
   * <p>For example, path <code>"/foo/:bar"</code> and object <code>{bar: "baz"}</code> will become
   * <code>"/foo/baz"</code>.<p>
   * @param params Parameters for the url
   */
  urlParams(params: Record<string, string | number>): this {
    this.url = Object.entries(params).reduce((url, [key, value]) => url.replace(`:${key}`, String(value)), this.url);
    return this;
  }

  query(query: Record<string, any>): this {
    this._query = query;
    return this;
  }

  body(body: ReqBody): this {
    this._body = body;
    return this;
  }

  json(body?: any): this {
    if (body) {
      this.body(JSON.stringify(body)).header("Content-Type", "application/json");
    }
    this._bodyLoader = async (response) => await response.json();
    return this;
  }

  formData(formData: FormData): this {
    return this.body(formData).header("Content-Type", "multipart/form-data");
  }

  validateRequest(validator: ResponseValidator<RecvBody>): this {
    this._resValidate = validator;
    return this;
  }

  loadBody(loader: ResponseBodyLoader<RecvBody>): this {
    this._bodyLoader = loader;
    return this;
  }

  mapBody(mapper: ResponseBodyMapper<RecvBody, MappedBody>): this {
    this._bodyMap = mapper;
    return this;
  }

  header(key: string, value: any): this {
    this._headers[key] = value;
    return this;
  }

  noTryRefreshJwt(): this {
    this._noTryRefreshJwt = true;
    return this;
  }

  build(): RestRequest<RecvBody, MappedBody> {
    return new RestRequest<RecvBody, MappedBody>({
      method: this.type,
      query: this._query,
      body: this._body,
      url: this.url,
      headers: this._headers,
      loadBody: this._bodyLoader,
      map: this._bodyMap,
      validate: this._resValidate
    });
  }
}
