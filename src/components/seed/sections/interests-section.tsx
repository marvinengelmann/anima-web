"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const EASE = [0.25, 0.46, 0.45, 0.94] as const

interface InterestsSectionProps {
  interests: string[]
  delay: number
}

export function InterestsSection({ interests, delay }: InterestsSectionProps) {
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
          <CardTitle>{t("interests")}</CardTitle>
          <CardDescription>{t("interestsDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {interests.map((interest, i) => (
            <motion.span
              key={interest}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: EASE, delay: delay + i * 0.04 }}
              className="rounded-lg border border-border/50 bg-muted px-3 py-1.5 text-sm"
            >
              {t(interest)}
            </motion.span>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
