import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  ListTodo,
  Loader2,
  Plus,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import type { Todo } from "shared";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useCreateTodo,
  useDeleteTodo,
  useTodos,
  useToggleTodo,
} from "@/lib/todos";

export const Route = createFileRoute("/todos")({
  component: TodosPage,
});

function TodosPage() {
  const todosQuery = useTodos();
  const createTodo = useCreateTodo();
  const [title, setTitle] = useState("");

  const todos = todosQuery.data ?? [];
  const remaining = todos.filter((t) => !t.completed).length;
  const trimmed = title.trim();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!trimmed) return;
    createTodo.mutate(trimmed, {
      onSuccess: () => setTitle(""),
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-muted/40 via-background to-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-primary/10 to-transparent blur-3xl"
      />
      <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-16 sm:py-24">
        <header className="flex flex-col gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" />
            bhvr todo app
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Stay on top of things
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            A tiny demo wired end-to-end: Hono RPC, TanStack Query optimistic
            updates, and shadcn/ui.
          </p>
        </header>

        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="border-b bg-card/50">
            <CardTitle className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ListTodo className="size-4" />
              </span>
              Todos
            </CardTitle>
            <CardDescription>
              {todosQuery.isError
                ? "Couldn't load your list"
                : todos.length === 0
                  ? "Add your first task below"
                  : `${remaining} of ${todos.length} remaining`}
            </CardDescription>
            <CardAction>
              <Badge variant="secondary" className="tabular-nums">
                {todos.length}
              </Badge>
            </CardAction>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                aria-label="New todo title"
                autoComplete="off"
              />
              <Button type="submit" disabled={!trimmed || createTodo.isPending}>
                {createTodo.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                Add
              </Button>
            </form>

            {todosQuery.isLoading ? (
              <TodoListSkeleton />
            ) : todosQuery.isError ? (
              <ErrorState onRetry={() => void todosQuery.refetch()} />
            ) : todos.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="-mx-2 divide-y divide-border rounded-lg border">
                {todos.map((todo) => (
                  <TodoRow key={todo.id} todo={todo} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function TodoRow({ todo }: { todo: Todo }) {
  const toggle = useToggleTodo();
  const del = useDeleteTodo();
  const optimistic = todo.id < 0;

  return (
    <li
      className={cn(
        "group flex items-center gap-3 px-4 py-3 transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-muted/50",
        optimistic && "opacity-60",
      )}
    >
      <Checkbox
        checked={todo.completed}
        disabled={optimistic}
        onCheckedChange={() =>
          toggle.mutate({ id: todo.id, completed: !todo.completed })
        }
        aria-label={
          todo.completed ? "Mark as not done" : "Mark as done"
        }
      />
      <span
        className={cn(
          "flex-1 text-sm transition-all",
          todo.completed && "text-muted-foreground line-through",
        )}
      >
        {todo.title}
      </span>
      <Button
        variant="ghost"
        size="icon"
        disabled={optimistic || del.isPending}
        onClick={() => del.mutate(todo.id)}
        aria-label={`Delete "${todo.title}"`}
        className="size-8 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Trash2 className="size-4" />
      </Button>
    </li>
  );
}

function TodoListSkeleton() {
  return (
    <ul className="divide-y divide-border rounded-lg border">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="size-4 rounded-[4px]" />
          <Skeleton className="h-4 flex-1" style={{ maxWidth: `${70 - i * 10}%` }} />
        </li>
      ))}
    </ul>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-12 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="size-5" />
      </div>
      <p className="text-sm font-medium">No todos yet</p>
      <p className="text-xs text-muted-foreground">
        Add something above to get started.
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-12 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Something went wrong</p>
        <p className="text-xs text-muted-foreground">
          We couldn't load your todos. Is the server running?
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
