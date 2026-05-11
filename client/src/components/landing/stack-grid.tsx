import { Badge } from "@/components/ui/badge"

type Tech = {
  name: string
  version: string
  role: string
  url: string
}

const STACK: Tech[] = [
  { name: "Bun", version: "1.2", role: "Runtime & package manager", url: "https://bun.sh" },
  { name: "Hono", version: "4.10", role: "Backend HTTP framework", url: "https://hono.dev" },
  { name: "Vite", version: "6.4", role: "Frontend bundler & dev server", url: "https://vitejs.dev" },
  { name: "React", version: "19.2", role: "UI library", url: "https://react.dev" },
  { name: "Turbo", version: "2.6", role: "Monorepo build orchestration", url: "https://turbo.build" },
  { name: "TypeScript", version: "5.7", role: "End-to-end type safety", url: "https://www.typescriptlang.org" },
  { name: "Tailwind CSS", version: "4.1", role: "Utility-first styling", url: "https://tailwindcss.com" },
  { name: "TanStack", version: "Router + Query", role: "Routing & server state", url: "https://tanstack.com" },
]

export function StackGrid() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The stack</h2>
        <p className="mt-3 text-muted-foreground">
          Modern, lightweight, and swappable — pick what you need, drop what you don't.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STACK.map((tech) => (
          <a
            key={tech.name}
            href={tech.url}
            target="_blank"
            rel="noopener"
            className="group flex flex-col gap-2 rounded-lg border bg-card p-5 transition-colors hover:border-foreground/20 hover:bg-accent"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">{tech.name}</span>
              <Badge variant="muted">{tech.version}</Badge>
            </div>
            <span className="text-sm text-muted-foreground">{tech.role}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
