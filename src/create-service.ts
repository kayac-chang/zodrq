import type { EndpointOption } from "./endpoint.js";

export type Config<Service> = Omit<EndpointOption, "path"> & {
  endpoints: {
    [key in keyof Service]: Service[key];
  };
};
function createService<Service>({ endpoints, ...config }: Config<Service>) {
  return Object.entries(endpoints).reduce(
    (service, [key, endpoint]) => ({
      ...service,
      [key]: (props: unknown, options: EndpointOption) =>
        typeof endpoint === "function" &&
        endpoint(props, {
          ...config,
          ...options,
        }),
    }),
    {} as Service
  );
}

export default createService;
