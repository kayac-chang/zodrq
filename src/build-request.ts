import parseURL from "./parse-url.js";
import parsePayload from "./parse-payload.js";
import parseHeaders from "./parse-headers.js";
import type { ParseURLOption } from "./parse-url.js";
import type { ParsePayloadOption } from "./parse-payload.js";
import type { ParseHeadersOption } from "./parse-headers.js";

export type BuildRequestOption = ParseURLOption &
  ParsePayloadOption &
  ParseHeadersOption;

async function buildRequest(option: BuildRequestOption, props: unknown) {
  return Promise.all([
    //  parse url
    parseURL(option, props),
    //  parse payload
    parsePayload(option, props),
    //  parse headers
    parseHeaders(option),
  ]).then(([url, body]) => new Request(url, { body }));
}

export default buildRequest;
