## ADDED Requirements

### Requirement: Shared todo types
The system SHALL define `Todo`, `CreateTodoInput`, and `UpdateTodoInput` types in the `shared` workspace, re-exported from `shared/src/index.ts`, so both server and client consume the same shapes. A `Todo` SHALL have `id` (number), `title` (string), `completed` (boolean), and `createdAt` (ISO string).

#### Scenario: Server and client import the same Todo type
- **WHEN** `shared` is built and `server` and `client` typecheck
- **THEN** both resolve `Todo` from `import ... from "shared"` with identical fields

### Requirement: List todos
The system SHALL expose `GET /todos` returning a JSON array of `Todo` ordered by `id` ascending.

#### Scenario: Empty store
- **WHEN** no todos exist and a client requests `GET /todos`
- **THEN** the server responds `200` with `[]`

#### Scenario: Non-empty store
- **WHEN** todos exist and a client requests `GET /todos`
- **THEN** the server responds `200` with all todos as a JSON array

### Requirement: Create todo
The system SHALL expose `POST /todos` accepting `{ title: string }`. The server SHALL trim the title, reject empty titles with `400` and a `{ message }` body, otherwise create a todo with a unique incrementing `id`, `completed: false`, and `createdAt` set to now, and respond `201` with the created `Todo`.

#### Scenario: Valid title
- **WHEN** a client sends `POST /todos` with `{ "title": "Buy milk" }`
- **THEN** the server responds `201` with a `Todo` having `title: "Buy milk"`, `completed: false`, a numeric `id`, and a `createdAt` timestamp
- **AND** a subsequent `GET /todos` includes that todo

#### Scenario: Empty or whitespace title
- **WHEN** a client sends `POST /todos` with `{ "title": "   " }` or a missing title
- **THEN** the server responds `400` with a `{ message }` body and creates nothing

### Requirement: Update todo
The system SHALL expose `PATCH /todos/:id` accepting a partial `{ title?: string; completed?: boolean }`. The server SHALL apply provided fields to the matching todo (trimming `title`, rejecting an empty `title` with `400`), respond `200` with the updated `Todo`, or respond `404` with `{ message }` if no todo has that `id`.

#### Scenario: Toggle completed
- **WHEN** a client sends `PATCH /todos/1` with `{ "completed": true }` and todo `1` exists
- **THEN** the server responds `200` with that todo's `completed` now `true`

#### Scenario: Unknown id
- **WHEN** a client sends `PATCH /todos/999` and no todo `999` exists
- **THEN** the server responds `404` with a `{ message }` body

#### Scenario: Empty title in update
- **WHEN** a client sends `PATCH /todos/1` with `{ "title": "  " }`
- **THEN** the server responds `400` and leaves the todo unchanged

### Requirement: Delete todo
The system SHALL expose `DELETE /todos/:id`. The server SHALL remove the matching todo and respond `200` (with the deleted `Todo` or `{ success: true }`), or respond `404` with `{ message }` if no todo has that `id`.

#### Scenario: Delete existing
- **WHEN** a client sends `DELETE /todos/1` and todo `1` exists
- **THEN** the server responds `200` and a subsequent `GET /todos` omits todo `1`

#### Scenario: Delete unknown id
- **WHEN** a client sends `DELETE /todos/999` and no todo `999` exists
- **THEN** the server responds `404` with a `{ message }` body

### Requirement: RPC type accuracy
The `/todos` routes SHALL be part of the chained Hono app value such that `AppType = typeof app` carries their request/response types, enabling `hc<AppType>` on the client to type the todo calls without `any`.

#### Scenario: Client RPC client is typed
- **WHEN** the client calls `client.todos.$get()` after `server/dist/index.d.ts` is regenerated
- **THEN** the response is typed as `Todo[]` (not `any`) with no manual casting
