export interface ParseHeadersOption {
  headers?: Headers | Record<string, string>;
  contentType?: "json";
}

function parseHeaders(option: ParseHeadersOption) {
  const headers = new Headers(option.headers);

  headers.set("Content-Type", "application/json");

  return headers;
}
export default parseHeaders;
