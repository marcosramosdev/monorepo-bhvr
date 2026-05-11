import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { ApiResponse, Todo } from "shared";

const app = new Hono()
  .use("*", cors({ origin: process.env.CLIENT_URL ?? "*" }))
  .use("*", logger())
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .get("/hello", (c) => {
    return c.json<ApiResponse>(
      { message: "Hello BHVR!", success: true },
      { status: 200 },
    );
  })
  .get("/todos", (c) => {
    return c.json<Todo[]>([
      { id: 1, title: "Learn React Router", completed: false },
    ]);
  });

export type AppType = typeof app;

// Bun (`bun run`) auto-serves a default export with a `fetch` handler on `port`.
// Cloudflare Workers accept the same `{ fetch }` shape (and ignore `port`).
export default {
  port: Number(process.env.PORT) || 3001,
  fetch: app.fetch,
};
