import { z } from "zod";
import endpoint from "./endpoint";
import createService from "./create-service";

const service = createService({
  endpoints: {
    getPosts: endpoint({
      method: "get",
      path: "/posts",
    }),
    getPost: endpoint({
      method: "get",
      path: "/posts/:id",
      params: z.object({ id: z.string() }),
    }),
  },
});

service.getPosts();
service.getPost({ id: "1" });
// @ts-expect-error
service.getPost({ id: "1", name: "test" });
