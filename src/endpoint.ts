import type { BuildRequestOption } from "./build-request";
import type { ResponseOption } from "./handle-response";
import type { ZodType } from "zod";
import buildRequest from "./build-request";
import handleResponse from "./handle-response";

const defaultFetcher = fetch;

type Fetcher = (request: Request) => Promise<Response>;
interface FetcherOption {
  fetcher?: Fetcher;
}

export type EndpointOption = BuildRequestOption & FetcherOption & ResponseOption;
type Task<Props, Return> = (props: Props, option?: EndpointOption) => Promise<Return>;

// get <url>
// post <url>
function endpoint
  (option: { method: "get" | "post", path: string })
    : Task<void, unknown>;

// get <url>/:id
// post <url>/:id
function endpoint<Params>
  (option: { method: "get" | "post", path: string, params: ZodType<Params> })
    : Task<Params, unknown>;

// get <url>?searchParams
function endpoint<SearchParams>
  (option: { method: "get", path: string, searchParams: ZodType<SearchParams> })
    : Task<SearchParams, unknown>;

// get <url>/:id?searchParams
function endpoint<Params, SearchParams>
  (option: { method: "get", path: string, params: ZodType<Params>, searchParams: ZodType<SearchParams> })
    : Task<Params & SearchParams, unknown>;

// get <url> with response
// post <url> with response
function endpoint<Return>
  (option: { method: "get" | "post", path: string, response: ZodType<Return> })
    : Task<void, Return>;

// get <url>/:id with response
// post <url>/:id with response
function endpoint<Params, Return>
  (option: { method: "get" | "post", path: string, params: ZodType<Params>, response: ZodType<Return> })
    : Task<Params, Return>;

// get <url>?searchParams with response
function endpoint<SearchParams, Return>
  (option: { method: "get", path: string, searchParams: ZodType<SearchParams>, response: ZodType<Return> })
    : Task<SearchParams, Return>;

// get <url>/:id?searchParams with response
function endpoint<Params, SearchParams, Return>
  (option: { method: "get", path: string, params: ZodType<Params>, searchParams: ZodType<SearchParams>, response: ZodType<Return> })
    : Task<Params & SearchParams, Return>;

// post <url> with body
function endpoint<Body>
  (option: { method: "post", path: string, body: ZodType<Body> })
    : Task<Body, unknown>;

// post <url> with body and response
function endpoint<Body, Return>
  (option: { method: "post", path: string, body: ZodType<Body>, response: ZodType<Return> })
    : Task<Body, Return>;

// post <url>/:id with body
function endpoint<Params, Body>
  (option: { method: "post", path: string, params: ZodType<Params>, body: ZodType<Body> })
    : Task<Params & Body, unknown>;

// post <url>/:id with body and response
function endpoint<Params, Body, Return>
  (option: { method: "post", path: string, params: ZodType<Params>, body: ZodType<Body>, response: ZodType<Return> })
    : Task<Params & Body, Return>;

function endpoint(option: EndpointOption): Task<unknown, unknown> {
  return (props, _option) =>
    Promise.resolve({ ...option, ..._option })
      .then((option) =>
        // build request
        buildRequest(option, props)
        // fetch
        .then(option.fetcher || defaultFetcher)
        // handle response
        .then(handleResponse(option))
      )
}

export type Endpoint = typeof endpoint;
export default endpoint;
