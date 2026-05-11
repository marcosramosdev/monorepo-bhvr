export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string; // ISO timestamp
}

export type CreateTodoInput = { title: string };
export type UpdateTodoInput = { title?: string; completed?: boolean };
