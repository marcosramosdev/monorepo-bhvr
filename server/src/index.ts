import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { validator } from "hono/validator";
import type { ApiResponse, UpdateTodoInput } from "shared";
import * as store from "./todos/store";

const todosApp = new Hono()
  .get("/", (c) => {
    return c.json(store.list(), 200);
  })
  .post(
    "/",
    validator("json", (value, c) => {
      const title = (value as { title?: unknown } | null)?.title;
      if (typeof title !== "string" || title.trim() === "") {
        return c.json({ message: "Title is required" }, 400);
      }
      return { title };
    }),
    (c) => {
      const { title } = c.req.valid("json");
      return c.json(store.create({ title }), 201);
    },
  )
  .patch(
    "/:id",
    validator("json", (value, c) => {
      const body = (value ?? {}) as { title?: unknown; completed?: unknown };
      const patch: UpdateTodoInput = {};
      if (body.title !== undefined) {
        if (typeof body.title !== "string" || body.title.trim() === "") {
          return c.json({ message: "Title cannot be empty" }, 400);
        }
        patch.title = body.title;
      }
      if (body.completed !== undefined) {
        if (typeof body.completed !== "boolean") {
          return c.json({ message: "completed must be a boolean" }, 400);
        }
        patch.completed = body.completed;
      }
      return patch;
    }),
    (c) => {
      const id = Number(c.req.param("id"));
      const updated = store.update(id, c.req.valid("json"));
      if (!updated) {
        return c.json({ message: "Todo not found" }, 404);
      }
      return c.json(updated, 200);
    },
  )
  .delete("/:id", (c) => {
    const id = Number(c.req.param("id"));
    const removed = store.remove(id);
    if (!removed) {
      return c.json({ message: "Todo not found" }, 404);
    }
    return c.json(removed, 200);
  });

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
  .route("/todos", todosApp);

export type AppType = typeof app;

// Bun (`bun run`) auto-serves a default export with a `fetch` handler on `port`.
// Cloudflare Workers accept the same `{ fetch }` shape (and ignore `port`).
export default {
  port: Number(process.env.PORT) || 3001,
  fetch: app.fetch,
};
