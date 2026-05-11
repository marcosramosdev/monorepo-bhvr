import { Boxes, Globe, ShieldCheck, Share2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Feature = {
  icon: LucideIcon
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: ShieldCheck,
    title: "End-to-end TypeScript",
    description:
      "One language from the database call to the DOM. Refactor with confidence — the compiler has your back across the whole stack.",
  },
  {
    icon: Share2,
    title: "Shared types package",
    description:
      "A `shared` workspace holds the contracts both client and server import. Change a response shape once; both sides update.",
  },
  {
    icon: Boxes,
    title: "Monorepo + Turbo",
    description:
      "Bun workspaces for client, server, and shared. Turbo handles task ordering, parallelism, and build caching out of the box.",
  },
  {
    icon: Globe,
    title: "Deploy anywhere",
    description:
      "No vendor lock-in. Ship the client to any static host and the server to Bun, Node, or a Cloudflare Worker — your call.",
  },
]

export function Features() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why bhvr?</h2>
          <p className="mt-3 text-muted-foreground">
            Built on the opinion that you shouldn't trade type safety for flexibility.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4 rounded-lg border bg-card p-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Icon className="size-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
