import parseURL from "./parse-url";
import parsePayload from "./parse-payload";
import parseHeaders from "./parse-headers";
import type { ParseURLOption } from "./parse-url";
import type { ParsePayloadOption } from "./parse-payload";
import type { ParseHeadersOption } from "./parse-headers";

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
