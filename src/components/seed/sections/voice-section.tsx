"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { VoiceCharacteristics } from "@/lib/seed/types"

const EASE = [0.25, 0.46, 0.45, 0.94] as const

interface VoiceSectionProps {
  voice: VoiceCharacteristics
  delay: number
}

export function VoiceSection({ voice, delay }: VoiceSectionProps) {
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
          <CardTitle>{t("voice")}</CardTitle>
          <CardDescription>{t("voiceDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            {(["pitch", "pace", "resonance"] as const).map((key) => (
              <div key={key} className="flex flex-col items-center gap-1.5 rounded-xl border border-border/50 bg-muted p-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t(key)}</span>
                <span className="text-sm font-mono">{t(voice[key])}</span>
              </div>
            ))}
          </div>

          {(["warmth", "breathiness"] as const).map((key) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs text-muted-foreground">{t(key)}</span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(voice[key] * 100)}%` }}
                  transition={{ duration: 0.8, ease: EASE, delay: delay + 0.1 }}
                  className="absolute inset-y-0 left-0 rounded-full bg-cyan-400"
                />
              </div>
              <span className="w-10 text-right font-mono text-xs text-muted-foreground">
                {Math.round(voice[key] * 100)}%
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
