## 1. Shared types

- [x] 1.1 Add `Todo`, `CreateTodoInput`, `UpdateTodoInput` to `shared/src/types/` (new file or extend existing)
- [x] 1.2 Re-export the new types from `shared/src/index.ts`
- [x] 1.3 Build shared (`bun run build:shared` or `turbo build --filter=shared`) so `shared/dist` is current

## 2. Server — in-memory store

- [x] 2.1 Create `server/src/todos/store.ts` with module-level `todos: Todo[]` + id counter
- [x] 2.2 Implement `list()`, `create(input)`, `update(id, patch)`, `remove(id)` helpers (trim title, return undefined on missing id)
- [x] 2.3 Add a couple of seed todos (optional, for first-run UX)

## 3. Server — CRUD routes

- [x] 3.1 Build a `todosApp` Hono sub-app (chained) or extend the chain in `src/index.ts`: `GET /todos`, `POST /todos`, `PATCH /todos/:id`, `DELETE /todos/:id`
- [x] 3.2 Validate `POST` body: non-empty trimmed `title` → else `400 { message }`; return `201` with created `Todo`
- [x] 3.3 Validate `PATCH` body: partial `{ title?, completed? }`; empty `title` → `400`; missing id → `404 { message }`; return `200` with updated `Todo`
- [x] 3.4 `DELETE`: missing id → `404 { message }`; else `200` with deleted `Todo`
- [x] 3.5 Mount via `.route("/todos", todosApp)` (or keep chained) so `AppType = typeof app` still carries the route types; remove the old hardcoded `/todos` stub
- [x] 3.6 Rebuild server / confirm `bun run dev:server` regenerates `server/dist/index.d.ts`
- [x] 3.7 Smoke-test endpoints with curl/HTTP client (list, create, toggle, delete, 400, 404)

## 4. Client — shadcn components

- [x] 4.1 Add needed shadcn/ui primitives under `client/src/components/ui/` (Button, Input, Checkbox, Card; Skeleton + Sonner/toast if used); reuse existing ones
- [x] 4.2 Add any new deps (Radix primitives, `class-variance-authority`) to `client/package.json` if not present
- [x] 4.3 Confirm no font/typography config changed in `client/src/index.css`

## 5. Client — data layer

- [x] 5.1 Add typed todo calls using the existing `hc<AppType>` client in `client/src/lib/api.ts` (or a `lib/todos.ts`)
- [x] 5.2 `useTodos()` query (`queryKey: ["todos"]`) calling `client.todos.$get()` → `Todo[]`
- [x] 5.3 `useCreateTodo()` mutation with `onMutate` snapshot + optimistic add, `onError` rollback, `onSettled` invalidate `["todos"]`
- [x] 5.4 `useToggleTodo()` mutation (PATCH `completed`) with optimistic update + rollback
- [x] 5.5 `useDeleteTodo()` mutation (DELETE) with optimistic remove + rollback
- [x] 5.6 Surface mutation failures via toast

## 6. Client — /todos route & UI

- [x] 6.1 Create `client/src/routes/todos.tsx`; let the router plugin regenerate `routeTree.gen.ts` (do not hand-edit)
- [x] 6.2 Layout with shadcn Card: header, add-todo form (Input + Button), todo list
- [x] 6.3 Render todos: Checkbox toggles completion, title with completed styling, delete button per row
- [x] 6.4 Loading state (Skeleton), empty state, error state
- [x] 6.5 Disable/guard submit on empty title; clear input on success
- [x] 6.6 Apply `frontend-design` polish (spacing, hierarchy, subtle motion) without changing the font
- [x] 6.7 Add a link to `/todos` from the landing page (`/`)

## 7. Verify

- [x] 7.1 `bun run type-check` passes (shared built first) — also `bun run build` (`tsc -b` on client) green
- [x] 7.2 `bun run lint` passes (0 errors; 2 pre-existing react-refresh warnings in ui/badge.tsx, ui/button.tsx)
- [x] 7.3 API smoke-tested (GET/POST/PATCH/DELETE incl. 400/404) + `vite build` produces todos chunk; browser click-through left to the user
- [x] 7.4 RPC types confirmed — `tsc -b` green; PATCH/POST `json` bodies typed via `hono/validator`; no `any` casts in `client/src/lib/todos.ts`
