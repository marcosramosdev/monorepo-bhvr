import { CodeBlock } from "@/components/ui/code-block"

export function GetStarted() {
  return (
    <section id="get-started" className="mx-auto max-w-3xl scroll-mt-8 px-6 py-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Get started</h2>
        <p className="mt-3 text-muted-foreground">
          Scaffold a new project, install, and run everything with Turbo.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">1. Create a project</p>
          <CodeBlock code="bun create bhvr" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">2. Install & run</p>
          <CodeBlock
            code={"bun install\nbun run dev"}
            copyText="bun install && bun run dev"
          />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          That runs the Vite client and the Hono server together. Build with{" "}
          <code className="font-mono">bun run build</code>.
        </p>
      </div>
    </section>
  )
}
