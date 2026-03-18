"use client"

import { useTranslations } from "next-intl"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ValueBar } from "@/components/ui/value-bar"
import type { FreeEnergyState, PEChannelName } from "@/lib/types"

interface FreeEnergyCardProps {
  data: FreeEnergyState
}

const CHANNEL_COLORS: Record<PEChannelName, string> = {
  interoceptive: "var(--chart-1)",
  anticipatory: "var(--chart-2)",
  novelty: "var(--chart-3)",
  relational: "var(--chart-4)",
  coherence: "var(--chart-5)",
  dissonance: "var(--chart-6)",
  drive: "var(--chart-8)",
  forecast: "var(--chart-9)",
  metacognitive: "var(--chart-10)",
}

export function FreeEnergyCard({ data }: FreeEnergyCardProps) {
  const t = useTranslations("FreeEnergy")
  const allostaticPercent = Math.round(data.allostaticLoad * 100)
  const trendLabel = data.trend > 0.05 ? t("rising") : data.trend < -0.05 ? t("falling") : t("stable")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {t("dominant")}: {t(`channels.${data.dominantChannel}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("allostaticLoad")}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{trendLabel}</Badge>
              <span className="font-medium">{allostaticPercent}%</span>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <ValueBar percent={allostaticPercent} color={allostaticPercent > 70 ? "var(--chart-6)" : allostaticPercent > 40 ? "var(--chart-5)" : "var(--chart-3)"} />
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-sm text-muted-foreground">{t("predictionErrors")}</span>
          {data.channels.map((channel) => {
            const pePercent = Math.round(channel.rawError * 100)

            return (
              <div key={channel.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t(`channels.${channel.name}`)}</span>
                  <span className="font-medium">{pePercent}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <ValueBar percent={pePercent} color={CHANNEL_COLORS[channel.name]} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-lg border border-border/50 p-3">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">{t("accuracy")}</span>
            <p className="text-sm font-medium">{Math.round(data.decomposition.accuracy * 100)}%</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">{t("complexity")}</span>
            <p className="text-sm font-medium">{Math.round(data.decomposition.complexity * 100)}%</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">{t("totalFE")}</span>
            <p className="text-sm font-medium">{data.decomposition.total.toFixed(3)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
