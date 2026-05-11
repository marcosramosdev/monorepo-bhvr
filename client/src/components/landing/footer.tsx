const LINKS = [
  { label: "GitHub", url: "https://github.com/stevedylandev/bhvr" },
  { label: "bhvr.dev", url: "https://bhvr.dev" },
  { label: "Bun", url: "https://bun.sh" },
  { label: "Hono", url: "https://hono.dev" },
  { label: "Vite", url: "https://vitejs.dev" },
  { label: "React", url: "https://react.dev" },
]

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>Built with bhvr 🦫 — Bun · Hono · Vite · React</p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener"
              className="transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
