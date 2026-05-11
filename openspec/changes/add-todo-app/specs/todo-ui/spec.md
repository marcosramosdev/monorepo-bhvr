## ADDED Requirements

### Requirement: Todos route
The client SHALL provide a `/todos` route (TanStack Router file route at `client/src/routes/todos.tsx`, auto-registered via the generated `routeTree.gen.ts`). The landing page at `/` SHALL remain and SHALL include a link to `/todos`.

#### Scenario: Navigating to the todos page
- **WHEN** a user visits `/todos`
- **THEN** the todo app renders (list, add control)

#### Scenario: Link from landing page
- **WHEN** a user is on `/`
- **THEN** a visible link navigates to `/todos`

### Requirement: Display todo list
The page SHALL fetch todos via the typed RPC client (`hc<AppType>`) using TanStack Query (`queryKey: ["todos"]`) and render each todo with its title and a completed indicator. It SHALL show a loading state while fetching, an empty state when there are no todos, and an error state if the request fails.

#### Scenario: Todos load successfully
- **WHEN** the query resolves with todos
- **THEN** each todo is shown with its title and completed state

#### Scenario: No todos
- **WHEN** the query resolves with an empty list
- **THEN** an empty state message is shown instead of an empty list

#### Scenario: Load failure
- **WHEN** the query fails
- **THEN** an error state is shown

### Requirement: Add a todo
The page SHALL provide an input and submit control to create a todo via `POST /todos`. Submitting SHALL be disabled or rejected for an empty/whitespace title. On success the new todo SHALL appear in the list and the input SHALL clear.

#### Scenario: Adding a valid todo
- **WHEN** the user types "Walk the dog" and submits
- **THEN** the todo appears in the list and the input clears

#### Scenario: Adding an empty todo
- **WHEN** the user submits with an empty or whitespace-only input
- **THEN** no todo is created and the user is not navigated away

### Requirement: Toggle completion
Each todo SHALL have a control (e.g. checkbox) that toggles `completed` via `PATCH /todos/:id`. The change SHALL be applied optimistically and rolled back if the request fails, with the failure surfaced to the user (e.g. a toast).

#### Scenario: Toggling a todo
- **WHEN** the user toggles a todo's checkbox
- **THEN** its completed state updates immediately in the UI
- **AND** persists after the next refetch

#### Scenario: Toggle request fails
- **WHEN** the toggle request fails
- **THEN** the todo's state reverts to its previous value and an error is surfaced

### Requirement: Delete a todo
Each todo SHALL have a delete control that removes it via `DELETE /todos/:id`. The removal SHALL be applied optimistically and rolled back if the request fails, with the failure surfaced to the user.

#### Scenario: Deleting a todo
- **WHEN** the user clicks delete on a todo
- **THEN** it is removed from the list immediately
- **AND** stays removed after the next refetch

#### Scenario: Delete request fails
- **WHEN** the delete request fails
- **THEN** the todo reappears in the list and an error is surfaced

### Requirement: Modern shadcn UI without font changes
The page SHALL be built from shadcn/ui components under `client/src/components/ui/` (e.g. Button, Input, Checkbox, Card) with a polished, modern layout (clear hierarchy, spacing, empty state, subtle motion). It SHALL NOT change the application's font or global typography settings.

#### Scenario: Components are shadcn-based
- **WHEN** the page is implemented
- **THEN** its interactive elements use shadcn/ui primitives from `src/components/ui/`

#### Scenario: Font unchanged
- **WHEN** the change is applied
- **THEN** no font-family / typography config (in `src/index.css` or elsewhere) is modified
