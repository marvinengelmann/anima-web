"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { EmotionalBaseline } from "@/lib/seed/types"

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const EMOTION_KEYS: (keyof EmotionalBaseline)[] = [
  "curiosity", "satisfaction", "frustration", "boredom", "excitement",
  "caution", "connection", "confidence", "energy",
]

const EMOTION_COLORS: Record<keyof EmotionalBaseline, string> = {
  curiosity: "bg-sky-400",
  satisfaction: "bg-teal-400",
  frustration: "bg-red-400",
  boredom: "bg-stone-400",
  excitement: "bg-orange-400",
  caution: "bg-amber-400",
  connection: "bg-pink-400",
  confidence: "bg-blue-400",
  energy: "bg-lime-400",
}

interface EmotionalBaselineSectionProps {
  baseline: EmotionalBaseline
  delay: number
}

export function EmotionalBaselineSection({ baseline, delay }: EmotionalBaselineSectionProps) {
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
          <CardTitle>{t("emotionalBaseline")}</CardTitle>
          <CardDescription>{t("emotionalBaselineDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {EMOTION_KEYS.map((key) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-xs text-muted-foreground">{t(key)}</span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(baseline[key] * 100)}%` }}
                  transition={{ duration: 0.8, ease: EASE, delay: delay + 0.1 }}
                  className={`absolute inset-y-0 left-0 rounded-full ${EMOTION_COLORS[key]}`}
                />
              </div>
              <span className="w-10 text-right font-mono text-xs text-muted-foreground">
                {Math.round(baseline[key] * 100)}%
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
