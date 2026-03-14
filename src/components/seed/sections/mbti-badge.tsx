"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import type { PersonalityType } from "@/lib/seed/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const MBTI_LABELS: Record<PersonalityType, { name: string; group: string }> = {
  INTJ: { name: "The Architect", group: "Analysts" },
  INTP: { name: "The Logician", group: "Analysts" },
  ENTJ: { name: "The Commander", group: "Analysts" },
  ENTP: { name: "The Debater", group: "Analysts" },
  INFJ: { name: "The Advocate", group: "Diplomats" },
  INFP: { name: "The Mediator", group: "Diplomats" },
  ENFJ: { name: "The Protagonist", group: "Diplomats" },
  ENFP: { name: "The Campaigner", group: "Diplomats" },
  ISTJ: { name: "The Logistician", group: "Sentinels" },
  ISFJ: { name: "The Defender", group: "Sentinels" },
  ESTJ: { name: "The Executive", group: "Sentinels" },
  ESFJ: { name: "The Consul", group: "Sentinels" },
  ISTP: { name: "The Virtuoso", group: "Explorers" },
  ISFP: { name: "The Adventurer", group: "Explorers" },
  ESTP: { name: "The Entrepreneur", group: "Explorers" },
  ESFP: { name: "The Entertainer", group: "Explorers" },
}

const GROUP_COLORS: Record<string, string> = {
  Analysts: "text-violet-400",
  Diplomats: "text-emerald-400",
  Sentinels: "text-sky-400",
  Explorers: "text-amber-400",
}

interface MbtiBadgeProps {
  type: PersonalityType
  delay: number
}

export function MbtiBadge({ type, delay }: MbtiBadgeProps) {
  const t = useTranslations("Seed")
  const label = MBTI_LABELS[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay }}

      className="h-full"
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{t("mbti")}</CardTitle>
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
            <span className="text-lg font-serif">{label.name}</span>
            <span className={`text-xs font-mono tracking-wider uppercase ${GROUP_COLORS[label.group]}`}>
              {label.group}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
