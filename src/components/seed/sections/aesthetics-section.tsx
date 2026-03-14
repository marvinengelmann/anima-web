"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AestheticPreferences } from "@/lib/seed/types"

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const AESTHETIC_KEYS: (keyof AestheticPreferences)[] = [
  "colorTemperature", "colorSaturation", "formSharpness", "patternComplexity", "lightnessPreference",
]

interface AestheticsSectionProps {
  preferences: AestheticPreferences
  delay: number
}

export function AestheticsSection({ preferences, delay }: AestheticsSectionProps) {
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
          <CardTitle>{t("aesthetics")}</CardTitle>
          <CardDescription>{t("aestheticsDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {AESTHETIC_KEYS.map((key) => (
            <div key={key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t(`${key}Low`)}</span>
                <span className="font-medium text-foreground">{t(key)}</span>
                <span>{t(`${key}High`)}</span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(preferences[key] * 100)}%` }}
                  transition={{ duration: 0.8, ease: EASE, delay: delay + 0.1 }}
                  className="absolute inset-y-0 left-0 rounded-full bg-rose-400"
                />
                <div
                  className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full bg-foreground/30"
                  style={{ left: "50%" }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
