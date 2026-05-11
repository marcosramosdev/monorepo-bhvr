import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function LiveDemo() {
  const { mutate, data, error, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.hello.$get();
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      return res.json();
    },
  });

  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Live demo
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          The button calls <code className="font-mono text-sm">GET /hello</code>{" "}
          through the typed Hono RPC client. The route and response shape come
          from the server's <code className="font-mono text-sm">AppType</code> —
          a type-only import, erased at build, zero runtime coupling.
        </p>

        <div className="mt-8 flex justify-center">
          <Button size="lg" onClick={() => mutate()} disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            {isPending ? "Calling…" : "Call API"}
          </Button>
        </div>

        <div className="mt-6 min-h-[3.5rem]">
          {data && (
            <div className="mx-auto flex w-fit items-start gap-3 rounded-lg border bg-card p-4 text-left">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
              <pre className="font-mono text-sm">
                <code>
                  message: "{data.message}"<br />
                  success: {String(data.success)}
                </code>
              </pre>
            </div>
          )}
          {error && (
            <div className="mx-auto flex w-fit items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-left text-sm text-destructive">
              <TriangleAlert className="size-5 shrink-0" />
              <span>{(error as Error).message}. Is the server running?</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
