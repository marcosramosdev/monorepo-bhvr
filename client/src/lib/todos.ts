import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { Todo } from "shared";

import { api } from "@/lib/api";

export const todosQueryKey = ["todos"] as const;

type TodoContext = { previous: Todo[] | undefined };

async function readError(
  res: { json: () => Promise<unknown> },
  fallback: string,
): Promise<never> {
  let message = fallback;
  try {
    const body = (await res.json()) as { message?: string } | null;
    if (body?.message) message = body.message;
  } catch {
    // non-JSON body — keep the fallback
  }
  throw new Error(message);
}

export function useTodos() {
  return useQuery({
    queryKey: todosQueryKey,
    queryFn: async (): Promise<Todo[]> => {
      const res = await api.todos.$get();
      if (!res.ok) throw new Error("Failed to load todos");
      return res.json();
    },
  });
}

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation<Todo, Error, string, TodoContext>({
    mutationFn: async (title: string): Promise<Todo> => {
      const res = await api.todos.$post({ json: { title } });
      if (!res.ok) return readError(res, "Failed to add todo");
      return res.json();
    },
    onMutate: async (title: string) => {
      await qc.cancelQueries({ queryKey: todosQueryKey });
      const previous = qc.getQueryData<Todo[]>(todosQueryKey);
      const optimistic: Todo = {
        id: -Date.now(),
        title: title.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      qc.setQueryData<Todo[]>(todosQueryKey, (old) => [
        ...(old ?? []),
        optimistic,
      ]);
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(todosQueryKey, ctx.previous);
      toast.error(err.message || "Failed to add todo");
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}

export function useToggleTodo() {
  const qc = useQueryClient();
  return useMutation<
    Todo,
    Error,
    { id: number; completed: boolean },
    TodoContext
  >({
    mutationFn: async ({ id, completed }): Promise<Todo> => {
      const res = await api.todos[":id"].$patch({
        param: { id: String(id) },
        json: { completed },
      });
      if (!res.ok) return readError(res, "Failed to update todo");
      return res.json();
    },
    onMutate: async ({ id, completed }) => {
      await qc.cancelQueries({ queryKey: todosQueryKey });
      const previous = qc.getQueryData<Todo[]>(todosQueryKey);
      qc.setQueryData<Todo[]>(todosQueryKey, (old) =>
        (old ?? []).map((t) => (t.id === id ? { ...t, completed } : t)),
      );
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(todosQueryKey, ctx.previous);
      toast.error(err.message || "Failed to update todo");
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation<Todo, Error, number, TodoContext>({
    mutationFn: async (id: number): Promise<Todo> => {
      const res = await api.todos[":id"].$delete({
        param: { id: String(id) },
      });
      if (!res.ok) return readError(res, "Failed to delete todo");
      return res.json();
    },
    onMutate: async (id: number) => {
      await qc.cancelQueries({ queryKey: todosQueryKey });
      const previous = qc.getQueryData<Todo[]>(todosQueryKey);
      qc.setQueryData<Todo[]>(todosQueryKey, (old) =>
        (old ?? []).filter((t) => t.id !== id),
      );
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(todosQueryKey, ctx.previous);
      toast.error(err.message || "Failed to delete todo");
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}
