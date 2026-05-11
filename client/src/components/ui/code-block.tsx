import * as React from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"

type CodeBlockProps = {
  code: string
  /** Text copied to clipboard. Defaults to `code`. */
  copyText?: string
  className?: string
}

export function CodeBlock({ code, copyText, className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(copyText ?? code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy", error)
    }
  }

  return (
    <div
      className={cn(
        "group relative rounded-lg border bg-muted/50 font-mono text-sm",
        className
      )}
    >
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy to clipboard"
        className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
      <pre className="overflow-x-auto p-4 pr-12 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}
