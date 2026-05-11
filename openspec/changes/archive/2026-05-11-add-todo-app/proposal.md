## Why

The repo is still the `bhvr` template with a single hardcoded `/todos` stub and no client UI. We want a working todo app that exercises the type-sharing pipeline end-to-end: a Hono CRUD API whose `AppType` flows into a typed Hono RPC client on a modern shadcn-based React page.

## What Changes

- Add a shared `Todo` type (and create/update payload types) to `shared/`.
- Replace the hardcoded `GET /todos` stub with full CRUD on the Hono app, backed by an in-memory store:
  - `GET /todos` — list
  - `POST /todos` — create
  - `PATCH /todos/:id` — update (toggle `completed`, edit `title`)
  - `DELETE /todos/:id` — remove
- Keep the chained-app style so `AppType` reflects the new routes for the RPC client.
- Add a new `/todos` TanStack Router route with a modern UI built from shadcn/ui components (no font changes), styled via the `frontend-design` guidance.
- Wire the page to the API through the existing `hc<AppType>` client in `client/src/lib/api.ts` using TanStack Query, with optimistic updates + rollback on create/toggle/delete.
- Keep the landing page at `/`.

## Capabilities

### New Capabilities
- `todo-api`: Server-side CRUD endpoints for todos over Hono, with shared request/response types and an in-memory store.
- `todo-ui`: Client `/todos` route presenting the list with add, toggle-complete, and delete, using shadcn/ui components and TanStack Query with optimistic updates.

### Modified Capabilities
<!-- None — no existing specs in openspec/specs/. -->

## Impact

- `shared/src/types/` — new `Todo`, `CreateTodoInput`, `UpdateTodoInput` types; rebuild `shared/dist` before consumers typecheck.
- `server/src/index.ts` — replace `/todos` stub with CRUD chain + in-memory store; `AppType` changes, regenerating `server/dist/index.d.ts`.
- `client/` — new `src/routes/todos.tsx` (regenerates `routeTree.gen.ts`); todo query/mutation hooks; new shadcn/ui primitives under `src/components/ui/`; possible nav link from landing page.
- Dependencies — shadcn component deps as needed (e.g. Radix primitives, `class-variance-authority`), already partly present; no backend deps (in-memory only).
- Non-goals: persistence/DB, auth, multi-user, pagination, editing todo text inline (toggle + delete only for v1).
