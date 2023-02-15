import type { ZodOptionalType, ZodType } from "zod";
import { compile } from "path-to-regexp";

type Fetcher = (request: Request) => Promise<Response>;
type HttpMethod = "get" | "post" | "put" | "patch" | "head" | "delete";
type MimeType = "json";

interface BaseOption {
  headers?: Headers | Record<string, string>;
  path: string;
  fetcher?: Fetcher;
  accept?: MimeType;
  baseURL?: string;
}

interface SearchParamsOptions<SearchParams = object> {
  searchParamsSerializer?: (searchParams: SearchParams) => string;
  searchParams?: ZodType<SearchParams> | ZodOptionalType<ZodType<SearchParams>>;
}

interface ResponseOption<Response = unknown, Return = Response> {
  response?: ZodType<Response>;
  transform?: (response: Response) => Return;
}

interface Option<Params = object, Body = object> {
  method: HttpMethod;
  params?: ZodType<Params>;
  contentType?: MimeType;
  body?: ZodType<Body>;
}

export function endpoint(
  option: BaseOption & {
    method: HttpMethod;
  }
): () => Promise<unknown>;

export function endpoint<Params extends {}>(
  option: BaseOption & {
    method: HttpMethod;
    params: ZodType<Params>;
  }
): (option: Params) => Promise<unknown>;

export function endpoint<SearchParams extends {}>(
  option: BaseOption &
    SearchParamsOptions<SearchParams> & {
      method: HttpMethod;
    }
): (option: SearchParams) => Promise<unknown>;

export function endpoint<Param extends {}, SearchParams extends {}>(
  option: BaseOption &
    SearchParamsOptions<SearchParams> & {
      method: HttpMethod;
      params: ZodType<Param>;
    }
): (option: Param & SearchParams) => Promise<unknown>;

export function endpoint<Response extends unknown, Return = Response>(
  option: BaseOption &
    ResponseOption<Response, Return> & {
      method: HttpMethod;
    }
): () => Promise<Return>;

export function endpoint<
  Params extends {},
  Response extends unknown,
  Return = Response
>(
  option: BaseOption &
    ResponseOption<Response, Return> & {
      method: HttpMethod;
      params: ZodType<Params>;
    }
): (option: Params) => Promise<Return>;

export function endpoint<
  SearchParams extends {},
  Response extends unknown,
  Return = Response
>(
  option: BaseOption &
    SearchParamsOptions<SearchParams> &
    ResponseOption<Response, Return> & {
      method: HttpMethod;
    }
): (option?: SearchParams) => Promise<Return>;

export function endpoint<
  Params extends {},
  SearchParams extends {},
  Response extends unknown,
  Return = Response
>(
  option: BaseOption &
    SearchParamsOptions<SearchParams> &
    ResponseOption<Response, Return> & {
      method: HttpMethod;
      params: ZodType<Params>;
    }
): (option: Params & SearchParams) => Promise<Return>;

export function endpoint<Body extends {}>(
  option: BaseOption & {
    method: "post" | "put" | "patch";
    contentType?: MimeType;
    body: ZodType<Body>;
  }
): (option: Body) => Promise<unknown>;

export function endpoint<Params extends {}, Body extends {}>(
  option: BaseOption & {
    method: "post" | "put" | "patch";
    contentType?: MimeType;
    params: ZodType<Params>;
    body: ZodType<Body>;
  }
): (option: Params & Body) => Promise<unknown>;

export function endpoint<SearchParams extends {}, Body extends {}>(
  option: BaseOption &
    SearchParamsOptions<SearchParams> & {
      method: "post" | "put" | "patch";
      contentType?: MimeType;
      body: ZodType<Body>;
    }
): (option: SearchParams & Body) => Promise<unknown>;

export function endpoint<
  Params extends {},
  SearchParams extends {},
  Body extends {}
>(
  option: BaseOption &
    SearchParamsOptions<SearchParams> & {
      method: "post" | "put" | "patch";
      contentType?: MimeType;
      params: ZodType<Params>;
      body: ZodType<Body>;
    }
): (option: Params & SearchParams & Body) => Promise<unknown>;

export function endpoint<
  Body extends {},
  Response extends unknown,
  Return = Response
>(
  option: BaseOption &
    ResponseOption<Response, Return> & {
      method: "post" | "put" | "patch";
      contentType?: MimeType;
      body: ZodType<Body>;
      response: ZodType<Response>;
    }
): (option: Body) => Promise<Return>;

export function endpoint<
  Params extends {},
  Body extends {},
  Response extends unknown,
  Return = Response
>(
  option: BaseOption &
    ResponseOption<Response, Return> & {
      method: "post" | "put" | "patch";
      contentType?: MimeType;
      params: ZodType<Params>;
      body: ZodType<Body>;
    }
): (option: Params & Body) => Promise<Return>;

export function endpoint<
  SearchParams extends {},
  Body extends {},
  Response extends unknown,
  Return = Response
>(
  option: BaseOption &
    SearchParamsOptions<SearchParams> &
    ResponseOption<Response, Return> & {
      method: "post" | "put" | "patch";
      contentType?: MimeType;
      body: ZodType<Body>;
    }
): (option: SearchParams & Body) => Promise<Return>;

export function endpoint<
  Params extends {},
  SearchParams extends {},
  Body extends {},
  Response extends unknown,
  Return = Response
>(
  option: BaseOption &
    SearchParamsOptions<SearchParams> &
    ResponseOption<Response, Return> & {
      method: "post" | "put" | "patch";
      contentType?: MimeType;
      params: ZodType<Params>;
      body: ZodType<Body>;
    }
): (option: Params & SearchParams & Body) => Promise<Return>;

export function endpoint<
  P extends {},
  S extends {},
  B extends {},
  R extends unknown,
  Return = R
>(
  option: BaseOption &
    Option<P, B> &
    ResponseOption<R, Return> &
    SearchParamsOptions<S>
) {
  option.contentType ??= "json";
  option.accept ??= "json";
  option.searchParamsSerializer ??= defaultSearchParamsSerializer;
  option.fetcher ??= fetch;
  option.headers ??= {};

  const execute = (props?: object) =>
    Promise.resolve(props)
      .then(buildRequest(option))
      .catch(
        error(
          `error occurred during build request: ${option.method} ${option.path}`
        )
      )
      .then(option.fetcher)
      .catch(
        error(`error occurred during fetch: ${option.method} ${option.path}`)
      )
      .then(handleResponse(option))
      .catch(
        error(
          `error occurred during handle response: ${option.method} ${option.path}`
        )
      );

  return new Proxy(execute, {
    set(_obj, prop, value) {
      if (prop === "fetcher") {
        option.fetcher = value;
      }
      if (prop === "searchParamsSerializer") {
        option.searchParamsSerializer = value;
      }
      if (prop === "headers") {
        option.headers = value;
      }
      if (prop === "baseURL") {
        option.baseURL = value;
      }
      return false;
    },
    apply(_target, _thisArg, args) {
      return execute(...args);
    },
  });
}

function error(tag: string) {
  const name = "RequestError";

  return (error: Error) => {
    if (error.name === name) return Promise.reject(error);

    const _error = new Error(tag);
    _error.name = name;
    _error.stack = error.stack;
    return Promise.reject(_error);
  };
}

function defaultSearchParamsSerializer(searchParams: Record<string, string>) {
  return String(new URLSearchParams(searchParams));
}

function buildRequest(option: BaseOption & Option) {
  return (props?: object) =>
    Promise.all([
      parseURL(option)(props),
      option.body?.parseAsync(props).then(contentType(option)),
      headers(option),
    ]).then(
      ([url, body, headers]) => new Request(url, { ...option, headers, body })
    );
}

function headers(option: BaseOption & Option) {
  const headers = new Headers(option.headers);
  if (option.contentType === "json") {
    headers.set("Content-Type", "application/json");
  }
  if (option.accept === "json") {
    headers.set("Accept", "application/json");
  }

  return headers;
}

function contentType(option: Option) {
  return (body: object) => {
    switch (option.contentType) {
      case "json":
        return JSON.stringify(body);
    }

    throw new Error(`not support content type: ${option.contentType}`);
  };
}

function handleResponse<R, Return>(
  option: BaseOption & ResponseOption<R, Return>
) {
  return async (response: Response) => {
    switch (option.accept) {
      case "json":
        return response
          .json()
          .then(option.response?.parseAsync)
          .then(option.transform);
    }

    throw new Error(`not support accept: ${option.accept}`);
  };
}

function parseURL(option: BaseOption & Option & SearchParamsOptions) {
  const url = new URL(option.path, option.baseURL);

  return async (props?: object) => {
    // preprocess url params
    if (option.params) {
      const handle = compile(url.pathname, { encode: encodeURIComponent });

      const params = await option.params.parseAsync(props);

      url.pathname = handle(params);
    }

    // preprocess search params
    const searchParams = await option.searchParams?.parseAsync(props);
    if (searchParams && option.searchParamsSerializer) {
      url.search = option.searchParamsSerializer(searchParams);
    }

    return url.toString();
  };
}

export interface Config<Type> {
  searchParamsSerializer?: SearchParamsOptions["searchParamsSerializer"];
  fetcher?: Fetcher;
  endpoints: {
    [Key in keyof Type]: Type[Key];
  };
  headers?: Record<string, string>;
  baseURL?: string;
}
export function createService<T>(config: Config<T>) {
  function traverse(obj: any) {
    Object.values(obj).forEach((value: unknown) => {
      if (!value) return;

      if (typeof value === "function" && value.name === "execute") {
        (value as any).fetcher = config.fetcher;
        (value as any).searchParamsSerializer = config.searchParamsSerializer;
        (value as any).headers = config.headers;
        (value as any).baseURL = config.baseURL;
        return;
      }

      if (typeof value === "object") {
        traverse(value);
      }
    });
  }

  traverse(config.endpoints);

  return config.endpoints;
}
