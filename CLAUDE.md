# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Bun + Turbo monorepo. Workspaces: `server/` (Hono API), `client/` (Vite + React 19), `shared/` (TS types). Originated from the `bhvr` template; now growing a todo app on top.

## Commands

```bash
bun install              # installs all workspaces; postinstall builds shared + server
bun run dev              # turbo dev — runs all workspaces
bun run dev:client       # Vite dev server, port 3000
bun run dev:server       # bun --watch on src/index.ts (port 3001) + tsc --watch emitting .d.ts
bun run build            # turbo build (respects ^build ordering: shared → server/client)
bun run build:client     # tsc -b && vite build
bun run build:server     # tsc → dist/ (incl. dist/index.d.ts)
bun run lint             # turbo lint (only client has an eslint config)
bun run type-check       # turbo type-check
bun run test             # turbo test — no test files exist yet
```

Single-workspace turbo run: `turbo <task> --filter=<client|server|shared>`.

## Architecture

**Type-sharing pipeline — this is the core idea.** Two paths feed types from server to client:

1. `shared/` exports plain types (`shared/src/types/`) consumed by both sides via `import ... from "shared"`. It must be compiled to `shared/dist/` before consumers typecheck — `postinstall` and turbo's `^build` handle this.
2. `server/` exports `AppType = typeof app` from `server/src/index.ts`. The client imports it **type-only** (`import type { AppType } from "server"`) in `client/src/lib/api.ts` and builds a typed RPC client with `hc<AppType>(SERVER_URL)`. `verbatimModuleSyntax` erases the import, so no server code lands in the client bundle — runtime contact is just `fetch()` to `VITE_SERVER_URL` (default `http://localhost:3001`). Client and server stay independently deployable.

Consequence: editing server routes changes the client's RPC types, but the client only sees it after `server/dist/index.d.ts` is regenerated (`bun run dev:server` keeps a `tsc --watch` running for exactly this).

**server/** — Single chained Hono app in `src/index.ts` (`.use(...).get(...)`). Default export is `{ port, fetch }`: Bun's `bun run` auto-serves it; Cloudflare Workers accept the same shape. Env: `PORT` (default 3001), `CLIENT_URL` (CORS origin, defaults `*`).

**client/** — Vite + React 19.
- **Routing**: TanStack Router, file-based routes in `src/routes/` (`__root.tsx` + route files). `src/routeTree.gen.ts` is **generated** by `@tanstack/router-plugin` (in `vite.config.ts`, must precede `@vitejs/plugin-react`) with `autoCodeSplitting` — never hand-edit it.
- **Data**: TanStack Query; `QueryClientProvider` wraps `RouterProvider` in `src/main.tsx`.
- **Styling**: Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config.*`; config lives in `src/index.css`). shadcn-style primitives in `src/components/ui/` (see `components.json`); landing-page sections in `src/components/landing/`.
- **Alias**: `@/` → `client/src/` (set in both `vite.config.ts` and tsconfig).
- Dev server runs on port 3000 and expects the API at `localhost:3001`.

**openspec/** — OpenSpec spec-driven workflow config (`openspec/config.yaml`). Used via the `openspec-*` / `opsx:*` skills.
