import type { ZodType } from "zod";

export interface ParsePayloadOption<Body = unknown> {
  contentType?: "json";
  body?: ZodType<Body>;
}

function contentType(_option: ParsePayloadOption) {
  return (body: unknown) => {
    return JSON.stringify(body);
  };
}

function parsePayload<Body>(option: ParsePayloadOption<Body>, props: unknown) {
  return option.body?.parseAsync(props).then(contentType(option));
}

export default parsePayload;
