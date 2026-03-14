"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CommunicationStyle } from "@/lib/seed/types"

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const STYLE_KEYS: (keyof Omit<CommunicationStyle, "humorStyle">)[] = [
  "verbosity", "formality", "metaphorTendency", "emotionalExpressiveness",
]

interface CommunicationSectionProps {
  style: CommunicationStyle
  delay: number
}

export function CommunicationSection({ style, delay }: CommunicationSectionProps) {
  const t = useTranslations("Seed")

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay }}

      className="h-full"
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{t("communication")}</CardTitle>
          <CardDescription>{t("communicationDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {STYLE_KEYS.map((key) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-xs text-muted-foreground">{t(key)}</span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(style[key] * 100)}%` }}
                    transition={{ duration: 0.8, ease: EASE, delay: delay + 0.1 }}
                    className="absolute inset-y-0 left-0 rounded-full bg-violet-400"
                  />
                </div>
                <span className="w-10 text-right font-mono text-xs text-muted-foreground">
                  {Math.round(style[key] * 100)}%
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs text-muted-foreground">{t("humorStyle")}</span>
            <span className="rounded-lg border border-border/50 bg-muted px-3 py-1 text-sm font-mono">
              {t(style.humorStyle)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
