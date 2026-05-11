## Context

The repo is the `bhvr` Bun + Turbo monorepo (`server/` Hono, `client/` Vite + React 19, `shared/` TS types). The core mechanic is the type-sharing pipeline: `shared/` exports plain types; `server/` exports `AppType = typeof app`, and `client/src/lib/api.ts` builds `hc<AppType>(SERVER_URL)`. Today `/todos` is a hardcoded `GET` returning one object; there's no client UI for todos. This change builds a real todo app on that skeleton without touching the deployment story (client and server stay independently deployable; runtime contact is just `fetch`).

## Goals / Non-Goals

**Goals:**
- Full CRUD `/todos` on the Hono app, chained so `AppType` stays accurate for the RPC client.
- Shared `Todo` + input types in `shared/`, consumed by both sides.
- A modern `/todos` route in the client built from shadcn/ui components, using TanStack Query with optimistic updates + rollback.
- End-to-end type safety: editing a server route surfaces in the client's RPC types after `server/dist/index.d.ts` regenerates.

**Non-Goals:**
- Persistence / database / migrations (in-memory store only — resets on server restart).
- Auth, multi-user, or per-user todo scoping.
- Pagination, search, sorting.
- Inline editing of todo text (v1 = create, toggle complete, delete).
- Changing the app's font or global typography.

## Decisions

### Decision: In-memory store module
A single module (e.g. `server/src/todos/store.ts`) holds `let todos: Todo[]` plus `list / create / update / remove` helpers and an `id` counter. Routes call into it; no DB.
- **Why:** Keeps the change focused on the RPC pipeline + UI. Zero infra, zero deps.
- **Alternatives:** `bun:sqlite` (rejected for v1 — adds schema/migration surface for a demo app; easy to swap in later behind the same helper interface). Inline array in `index.ts` (rejected — clutters the route chain, harder to reset/test).

### Decision: Keep the single chained Hono app
Add the new routes to the existing `.use(...).get(...)` chain in `server/src/index.ts` (or a `.route("/todos", todosApp)` sub-app whose chain is also fully typed). Default export stays `{ port, fetch }`.
- **Why:** `AppType = typeof app` only carries route types if they're part of the chained value. A sub-app via `.route()` preserves this and keeps `index.ts` readable.
- **Alternatives:** Separate router attached imperatively without chaining (rejected — breaks RPC type inference).

### Decision: Validate request bodies with a lightweight check (or `@hono/zod-validator` if zod is acceptable)
`POST` requires a non-empty `title` (trimmed); `PATCH` accepts partial `{ title?, completed? }`. On bad input return `400` with `{ message }`. Start with a hand-rolled guard to avoid a new dep; upgrade to zod-validator only if the user wants it.
- **Why:** Don't trust client input even in a demo; keeps error shape consistent with `ApiResponse`.

### Decision: Shared types
`shared/src/types/` adds:
```ts
export interface Todo { id: number; title: string; completed: boolean; createdAt: string }
export type CreateTodoInput = { title: string }
export type UpdateTodoInput = { title?: string; completed?: boolean }
```
Re-exported from `shared/src/index.ts`. `postinstall` / turbo `^build` rebuild `shared/dist` before client/server typecheck.
- **Why:** Both sides reference the same `Todo` shape; the RPC client return type and the React state stay in lockstep.

### Decision: Client data layer — TanStack Query + `hc<AppType>` with optimistic updates
A `useTodos()` query (`queryKey: ["todos"]`) calls `client.todos.$get()`. Mutations (`useCreateTodo`, `useToggleTodo`, `useDeleteTodo`) call the typed RPC methods, with `onMutate` snapshotting the cache, applying the optimistic change, and `onError` rolling back; `onSettled` invalidates `["todos"]`.
- **Why:** Snappy UI for a list app; matches the existing TanStack Query setup in `main.tsx`.
- **Alternatives:** Plain invalidate-on-success (rejected per user choice; would be simpler but less responsive).

### Decision: UI — new file route `/todos`, shadcn/ui components, modern layout
Add `client/src/routes/todos.tsx` (auto-registered; `routeTree.gen.ts` regenerates — never hand-edited). Build with shadcn primitives in `client/src/components/ui/` (Button, Input, Checkbox, Card, plus Skeleton/Sonner for loading + toasts as needed). Apply `frontend-design` skill guidance for a polished, non-generic look (spacing, hierarchy, empty state, subtle motion) — but no font changes. Landing page stays at `/`; add a link to `/todos` from it.
- **Why:** User asked for a modern shadcn UI on a dedicated route without altering typography.
- **Alternatives:** Replace the index route (rejected per user choice).

## Risks / Trade-offs

- In-memory store loses data on restart and isn't shared across server instances → Acceptable for v1; documented as a non-goal. Helper interface makes a later `bun:sqlite` swap low-cost.
- Optimistic updates can show transient wrong state if a mutation fails → Mitigated by cache snapshot + `onError` rollback and `onSettled` invalidation; surface failures via a toast.
- Client RPC types lag until `server/dist/index.d.ts` regenerates → Mitigated by running `bun run dev:server` (keeps `tsc --watch`); call out in tasks.
- Adding shadcn components may pull new Radix/`cva` deps → Keep additions minimal; reuse what's already under `components/ui/`.
- ID collisions if the counter resets but stale client cache persists → Negligible for a single-process demo; full reload clears it.
