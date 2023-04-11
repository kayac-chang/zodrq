import type { ZodType } from "zod";
import { compile } from "path-to-regexp";

export interface ParseURLOption {
  path: string;
  baseURL?: string;
  params?: ZodType<Record<string, string>>;
  searchParams?: ZodType<Record<string, string>>;
  searchParamsSerializer?: (searchParams: Record<string, string>) => string;
}

const defaultSearchParamsSerializer = (searchParams: Record<string, string>) =>
  new URLSearchParams(searchParams).toString();

async function parseURL(option: ParseURLOption, props: unknown) {
  const url = new URL(option.path, option.baseURL);

  if (option.params) {
    const handle = compile(url.pathname, { encode: encodeURIComponent });

    const params = await option.params.parseAsync(props);

    url.pathname = handle(params);
  }

  if (option.searchParams) {
    const searchParams = await option.searchParams.parseAsync(props);

    const serialize =
      option.searchParamsSerializer ?? defaultSearchParamsSerializer;

    url.search = serialize(searchParams);
  }

  return url.toString();
}
export default parseURL;
