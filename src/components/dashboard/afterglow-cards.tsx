"use client"

import { useTranslations } from "next-intl"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AfterglowEntry } from "@/lib/types"
import { EMOTION_COLORS } from "@/lib/colors"

interface AfterglowCardsProps {
  entries: AfterglowEntry[]
}

export function AfterglowCards({ entries }: AfterglowCardsProps) {
  const t = useTranslations("Afterglow")
  const te = useTranslations("Emotions")

  if (entries.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry, i) => {
            const color = EMOTION_COLORS[entry.dimension]
            const isPositive = entry.delta > 0
            return (
              <div
                key={`${entry.dimension}-${i}`}
                className="relative overflow-hidden rounded-lg border border-border/50 p-3"
              >
                <div
                  className="absolute inset-0 opacity-5"
                  style={{ backgroundColor: color }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-medium">
                        {te(entry.dimension)}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-mono font-medium tabular-nums ${
                        isPositive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {isPositive ? "+" : ""}{(entry.delta * 100).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t("ticksRemaining", { count: entry.remainingTicks })}</span>
                    <span>
                      {t("intensity")}: {(entry.intensity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-2 h-1 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${entry.intensity * 100}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
