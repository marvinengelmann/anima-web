"use client"

import { useTranslations } from "next-intl"
import { Github } from "lucide-react"
import type { TimeRange } from "@/lib/types"
import { TimeRangeSelector } from "./time-range-selector"
import { ThemeToggle } from "./theme-toggle"
import { LanguageSwitcher } from "./language-switcher"

interface DashboardHeaderProps {
  range: TimeRange
}

export function DashboardHeader({ range }: DashboardHeaderProps) {
  const t = useTranslations("Dashboard")

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-sm font-semibold tracking-tight">ANIMA</span>
        </div>
        <TimeRangeSelector value={range} />
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            <span className="text-[11px] text-muted-foreground">{t("liveIndicator")}</span>
          </div>
          <a
            href="https://github.com/marvinengelmann/anima"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
