"use client"

import { useTranslations } from "next-intl"
import { Github } from "lucide-react"
import { Waves } from "@/components/ui/wave-background"

const PHASES = ["sense", "feel", "deliberate", "act", "maintain"] as const

export function HeroSection() {
  const t = useTranslations("Hero")

  return (
    <section className="relative overflow-hidden border-b border-border/50 py-20 sm:py-28">
      <div className="absolute inset-0 z-0">
        <Waves
          strokeColor="var(--color-border)"
          backgroundColor="transparent"
          pointerSize={0.4}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-4xl">
          <h1 className="max-w-3xl text-pretty text-4xl text-foreground md:text-6xl">
            {t("heading")}
          </h1>

          <div className="mt-8">
            <a
              href="https://github.com/marvinengelmann/anima"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border/50 bg-background px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              {t("github")}
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 overflow-hidden rounded-2xl border border-border/50 sm:mt-20 sm:grid-cols-5 [&>*+*]:border-l [&>*+*]:border-border/50">
          {PHASES.map((phase, i) => (
            <div
              key={phase}
              className="group relative cursor-default bg-background/80 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-primary/[0.03]"
            >
              <div className="mb-3 text-xs tabular-nums text-muted-foreground/50">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-sans text-sm font-medium">{t(phase)}</div>
              <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`${phase}Desc`)}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
