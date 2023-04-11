export interface ParseHeadersOption {
  headers?: Headers | Record<string, string>;
  accept?: "json";
  contentType?: "json";
}

function parseHeaders(option: ParseHeadersOption) {
  const headers = new Headers(option.headers);

  if (option.contentType === "json") {
    headers.set("Content-Type", "application/json");
  }

  if (option.accept === "json") {
    headers.set("Accept", "application/json");
  }

  return headers;
}
export default parseHeaders;
