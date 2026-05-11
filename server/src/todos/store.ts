import type { CreateTodoInput, Todo, UpdateTodoInput } from "shared";

let nextId = 1;

function seedTodo(title: string, completed: boolean): Todo {
  return {
    id: nextId++,
    title,
    completed,
    createdAt: new Date().toISOString(),
  };
}

let todos: Todo[] = [
  seedTodo("Learn the type-sharing pipeline", true),
  seedTodo("Build the todo API", false),
  seedTodo("Wire up the client UI", false),
];

export function list(): Todo[] {
  return [...todos].sort((a, b) => a.id - b.id);
}

export function create(input: CreateTodoInput): Todo {
  const todo: Todo = {
    id: nextId++,
    title: input.title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  return todo;
}

export function update(id: number, patch: UpdateTodoInput): Todo | undefined {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return undefined;
  if (patch.title !== undefined) todo.title = patch.title.trim();
  if (patch.completed !== undefined) todo.completed = patch.completed;
  return todo;
}

export function remove(id: number): Todo | undefined {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return undefined;
  const [removed] = todos.splice(index, 1);
  return removed;
}
