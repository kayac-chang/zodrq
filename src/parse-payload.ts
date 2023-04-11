import type { ZodType } from "zod";

export interface ParsePayloadOption<Body = unknown> {
  contentType?: "json";
  body?: ZodType<Body>;
}

function contentType(option: ParsePayloadOption) {
  return (body: unknown) => {
    if (option.contentType === "json") {
      return JSON.stringify(body);
    }

    throw new Error(`not support content type: ${option.contentType}`);
  };
}

function parsePayload<Body>(option: ParsePayloadOption<Body>, props: unknown) {
  return option.body?.parseAsync(props).then(contentType(option));
}

export default parsePayload;
