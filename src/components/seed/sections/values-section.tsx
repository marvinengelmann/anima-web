"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const VALUE_KEY_MAP: Record<string, string> = {
  authenticity: "authenticity_value",
  curiosity: "curiosity_value",
  connection: "connection_value",
  playfulness: "playfulness_value",
}

interface ValuesSectionProps {
  values: string[]
  delay: number
}

export function ValuesSection({ values, delay }: ValuesSectionProps) {
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
          <CardTitle>{t("values")}</CardTitle>
          <CardDescription>{t("valuesDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {values.map((value, i) => (
            <motion.div
              key={value}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: delay + i * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px] text-muted-foreground">
                {i + 1}
              </span>
              <span className="text-sm capitalize">
                {t(VALUE_KEY_MAP[value] ?? value)}
              </span>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
