"use client"

import { faLink } from "@fortawesome/pro-light-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import type { PersonalityType } from "@/lib/seed/types"

const EASE = [0.25, 0.46, 0.45, 0.94] as const

export const MBTI_GROUPS: Record<PersonalityType, string> = {
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

export const GROUP_GLOW_CLASSES: Record<string, string> = {
  analysts: "[--glow-color:rgba(167,139,250,0.15)] dark:[--glow-color:rgba(196,181,253,0.15)]",
  diplomats: "[--glow-color:rgba(52,211,153,0.15)] dark:[--glow-color:rgba(110,231,183,0.15)]",
  sentinels: "[--glow-color:rgba(56,189,248,0.15)] dark:[--glow-color:rgba(125,211,252,0.15)]",
  explorers: "[--glow-color:rgba(251,191,36,0.15)] dark:[--glow-color:rgba(253,224,71,0.15)]",
}

interface ResultsHeaderProps {
  type: PersonalityType
  seed: string
  copied: boolean
  onShare: () => void
  delay: number
}

export function ResultsHeader({ type, seed, copied, onShare, delay }: ResultsHeaderProps) {
  const t = useTranslations("Mbti")
  const tSeed = useTranslations("Seed")
  const group = MBTI_GROUPS[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      <div className="container py-6 md:py-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex flex-col items-center gap-1.5 md:items-start md:min-w-0 md:flex-1">
            <p className="font-mono text-sm text-muted-foreground tracking-wider">
              {seed}
            </p>
            <button
              type="button"
              onClick={onShare}
              className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-3 py-1.5 text-xs text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-foreground cursor-pointer"
            >
              <FontAwesomeIcon icon={faLink} className="h-3 w-3" />
              {copied ? tSeed("copied") : tSeed("share")}
            </button>
          </div>

          <div className="flex items-center gap-4">
            {type.split("").map((letter, i) => (
              <span
                key={i}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-card font-mono text-xl font-medium"
              >
                {letter}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-1 md:items-end md:min-w-0 md:flex-1">
            <span className="text-lg font-serif">{t(`${type}.name`)}</span>
            <span className={`text-xs font-mono tracking-wider uppercase ${GROUP_COLORS[group]}`}>
              {t(`${group}.label`)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
