import { ArrowRight, Github } from "lucide-react"

import beaver from "@/assets/beaver.svg"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const REPO_URL = "https://github.com/stevedylandev/bhvr"
const DOCS_URL = "https://bhvr.dev"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      {/* soft radial backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.97_0_0),transparent)]"
      />
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center sm:py-32">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener"
          className="animate-in fade-in zoom-in-50 duration-700"
        >
          <img
            src={beaver}
            alt="bhvr beaver logo"
            className="size-16 transition-transform hover:scale-110"
          />
        </a>

        <Badge variant="muted" className="animate-in fade-in slide-in-from-bottom-2 duration-700">
          Bun · Hono · Vite · React
        </Badge>

        <h1 className="animate-in fade-in slide-in-from-bottom-3 text-5xl font-black tracking-tight duration-700 sm:text-7xl">
          bhvr
        </h1>

        <p className="animate-in fade-in slide-in-from-bottom-4 max-w-xl text-balance text-lg text-muted-foreground duration-700 sm:text-xl">
          A typesafe fullstack monorepo starter — end-to-end TypeScript, shared
          types, and zero vendor lock-in.
        </p>

        <div className="animate-in fade-in slide-in-from-bottom-5 flex flex-wrap items-center justify-center gap-3 duration-700">
          <Button size="lg" asChild>
            <a href="#get-started">
              Quick start
              <ArrowRight />
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href={REPO_URL} target="_blank" rel="noopener">
              <Github />
              GitHub
            </a>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <a href={DOCS_URL} target="_blank" rel="noopener">
              Docs
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
