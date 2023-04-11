import { z } from "zod";
import endpoint from "./endpoint";

// get <url>
{
  const test = endpoint({
    method: "get",
    path: "/api/v1/users",
  });

  //pass
  test();
}

// get <url>/:id
{
  const test = endpoint({
    method: "get",
    path: "/api/v1/users/:id",
    params: z.object({ id: z.string() }),
  });

  //@ts-expect-error
  test();
  //@ts-expect-error
  test({ id: "1", name: "test" });
  //pass
  test({ id: "1" });
}

// get <url>?name=:name
{
  const test = endpoint({
    method: "get",
    path: "/api/v1/users",
    searchParams: z.object({ name: z.string() }),
  });

  //@ts-expect-error
  test();
  //@ts-expect-error
  test({ id: "1", name: "test" });
  //pass
  test({ name: "1" });
}

// get <url>/:id?name=:name
{
  const test = endpoint({
    method: "get",
    path: "/api/v1/users/:id",
    params: z.object({ id: z.string() }),
    searchParams: z.object({ name: z.string() }),
  });

  //@ts-expect-error
  test();
  //@ts-expect-error
  test({ id: "1" });
  //@ts-expect-error
  test({ name: "1" });
  //pass
  test({ id: "1", name: "test" });
}

// get <url> with response
{
  const test = endpoint({
    method: "get",
    path: "/api/v1/users",
    response: z.object({ id: z.string(), name: z.string() }),
  });

  test();
}

// get <url>/:id with response
{
  const test = endpoint({
    method: "get",
    path: "/api/v1/users/:id",
    params: z.object({ id: z.string() }),
    response: z.object({ id: z.string(), name: z.string() }),
  });

  //@ts-expect-error
  test();
  //@ts-expect-error
  test({ id: "1", name: "test" });
  //pass
  test({ id: "1" });
}

// get <url>?name=:name with response
{
  const test = endpoint({
    method: "get",
    path: "/api/v1/users",
    searchParams: z.object({ name: z.string() }),
    response: z.object({ id: z.string(), name: z.string() }),
  });

  //@ts-expect-error
  test();
  //@ts-expect-error
  test({ id: "1", name: "test" });
  //pass
  test({ name: "1" });
}

// get <url>/:id?name=:name with response
{
  const test = endpoint({
    method: "get",
    path: "/api/v1/users/:id",
    params: z.object({ id: z.string() }),
    searchParams: z.object({ name: z.string() }),
    response: z.object({ id: z.string(), name: z.string() }),
  });

  //@ts-expect-error
  test();
  //@ts-expect-error
  test({ id: "1" });
  //@ts-expect-error
  test({ name: "1" });
  //pass
  test({ id: "1", name: "test" });
}

// post <url>
{
  const test = endpoint({
    method: "post",
    path: "/api/v1/users",
  });

  //pass
  test();
}

// post <url> with body
{
  const test = endpoint({
    method: "post",
    path: "/api/v1/users",
    body: z.object({ name: z.string() }),
  });

  //@ts-expect-error
  test();
  //pass
  test({ name: "test" });
}

// post <url> with response
{
  const test = endpoint({
    method: "post",
    path: "/api/v1/users",
    response: z.object({ id: z.string(), name: z.string() }),
  });

  test();
}

// post <url> with body and response
{
  const test = endpoint({
    method: "post",
    path: "/api/v1/users",
    body: z.object({ name: z.string() }),
    response: z.object({ id: z.string(), name: z.string() }),
  });

  //@ts-expect-error
  test();
  //pass
  test({ name: "test" });
}

// post <url>/:id
{
  const test = endpoint({
    method: "post",
    path: "/api/v1/users/:id",
    params: z.object({ id: z.string() }),
  });

  //@ts-expect-error
  test();
  //@ts-expect-error
  test({ id: "1", name: "test" });
  //pass
  test({ id: "1" });
}

// post <url>/:id with body
{
  const test = endpoint({
    method: "post",
    path: "/api/v1/users/:id",
    params: z.object({ id: z.string() }),
    body: z.object({ name: z.string() }),
  });

  //@ts-expect-error
  test();
  //@ts-expect-error
  test({ id: "1" });
  //pass
  test({ id: "1", name: "test" });
}

// post <url>/:id with response
{
  const test = endpoint({
    method: "post",
    path: "/api/v1/users/:id",
    params: z.object({ id: z.string() }),
    response: z.object({ id: z.string(), name: z.string() }),
  });

  //@ts-expect-error
  test();
  //@ts-expect-error
  test({ id: "1", name: "test" });
  //pass
  test({ id: "1" });
}

// post <url>/:id with body and response
{
  const test = endpoint({
    method: "post",
    path: "/api/v1/users/:id",
    params: z.object({ id: z.string() }),
    body: z.object({ name: z.string() }),
    response: z.object({ id: z.string(), name: z.string() }),
  });

  //@ts-expect-error
  test();
  //@ts-expect-error
  test({ id: "1" });
  //pass
  test({ id: "1", name: "test" });
}
