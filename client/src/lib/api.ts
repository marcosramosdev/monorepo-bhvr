import { hc } from "hono/client";
import type { AppType } from "server";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

// Type-only `AppType` import — erased at build time (verbatimModuleSyntax),
// so the client bundle never contains server code. Runtime contact is just
// fetch() to SERVER_URL, keeping client and server independently deployable.
export const api = hc<AppType>(SERVER_URL);
