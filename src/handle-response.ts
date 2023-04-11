import type { ZodType } from "zod";

export interface ResponseOption {
  response?: ZodType<unknown>;
}
function handleResponse(option: ResponseOption) {
  return (response: Response) =>
    response
      //
      .json()
      .then(option.response?.parseAsync);
}
export default handleResponse;
