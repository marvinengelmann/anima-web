"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { AnimatePresence, motion } from "framer-motion"
import {
  Activity,
  Brain,
  Heart,
  Database,
  Users,
  Fingerprint,
  Sparkles,
  MessageCircle,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const FEATURE_KEYS = [
  "consciousness",
  "affect",
  "cognition",
  "memory",
  "relationship",
  "identity",
  "communication",
  "evolution",
] as const

const FEATURE_ICONS: Record<(typeof FEATURE_KEYS)[number], LucideIcon> = {
  consciousness: Activity,
  affect: Heart,
  cognition: Brain,
  memory: Database,
  relationship: Users,
  identity: Fingerprint,
  communication: MessageCircle,
  evolution: Sparkles,
}

export function FeaturesSection() {
  const t = useTranslations("Features")
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="border-b border-border/50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-pretty text-3xl sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground lg:text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="relative mt-14 grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURE_KEYS.map((key, idx) => {
            const Icon = FEATURE_ICONS[key]
            return (
              <div
                key={key}
                className="group relative block h-full w-full cursor-pointer p-2"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {hoveredIndex === idx && (
                    <motion.span
                      className="absolute inset-0 block h-full w-full rounded-2xl border border-primary/10 bg-primary/[0.03] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-xl"
                      layoutId="featureHover"
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>

                <div className="relative z-10 flex h-full flex-col items-center justify-start gap-3 rounded-2xl p-5 text-center">
                  <Icon className="mt-2 h-7 w-7 stroke-[1.5] text-muted-foreground transition-colors group-hover:text-primary" />
                  <h3 className="text-xl">{t(`${key}Title`)}</h3>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {t(`${key}Desc`)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
