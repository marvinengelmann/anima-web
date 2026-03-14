"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import type { PersonalityType } from "@/lib/seed/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const MBTI_GROUPS: Record<PersonalityType, string> = {
  INTJ: "analysts", INTP: "analysts", ENTJ: "analysts", ENTP: "analysts",
  INFJ: "diplomats", INFP: "diplomats", ENFJ: "diplomats", ENFP: "diplomats",
  ISTJ: "sentinels", ISFJ: "sentinels", ESTJ: "sentinels", ESFJ: "sentinels",
  ISTP: "explorers", ISFP: "explorers", ESTP: "explorers", ESFP: "explorers",
}

const GROUP_COLORS: Record<string, string> = {
  analysts: "text-violet-400",
  diplomats: "text-emerald-400",
  sentinels: "text-sky-400",
  explorers: "text-amber-400",
}

interface MbtiBadgeProps {
  type: PersonalityType
  delay: number
}

export function MbtiBadge({ type, delay }: MbtiBadgeProps) {
  const t = useTranslations("Mbti")
  const tSeed = useTranslations("Seed")
  const group = MBTI_GROUPS[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay }}

      className="h-full"
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{tSeed("mbti")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3 py-6">
          <div className="flex items-center gap-4">
            {type.split("").map((letter, i) => (
              <span
                key={i}
                className="flex h-14 w-14 items-center justify-center rounded-xl border border-border/50 bg-muted font-mono text-2xl font-medium"
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-serif">{t(`${type}.name`)}</span>
            <span className={`text-xs font-mono tracking-wider uppercase ${GROUP_COLORS[group]}`}>
              {t(`${group}.label`)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
