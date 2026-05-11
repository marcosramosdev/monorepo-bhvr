import { CodeBlock } from "@/components/ui/code-block"

const TREE = `.
├── client/      # React + Vite frontend
├── server/      # Hono API on Bun
├── shared/      # TypeScript types used by both
│   └── src/types/
├── package.json # Bun workspaces
└── turbo.json   # Turbo task pipeline`

const PARTS = [
  { name: "client/", desc: "Vite + React 19 app. TanStack Router for file-based routes, TanStack Query for server state." },
  { name: "server/", desc: "Hono app running on the Bun runtime. Express-like routes, CORS ready." },
  { name: "shared/", desc: "Plain TS package compiled and re-exported so both sides import the same types." },
]

export function Structure() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Project structure</h2>
        <p className="mt-3 text-muted-foreground">
          Three workspaces, one source of truth for types.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
        <CodeBlock code={TREE} />
        <ul className="space-y-4">
          {PARTS.map((p) => (
            <li key={p.name} className="rounded-lg border bg-card p-4">
              <code className="font-mono text-sm font-semibold">{p.name}</code>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
