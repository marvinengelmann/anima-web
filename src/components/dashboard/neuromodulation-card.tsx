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
import { NEUROMODULATOR_KEYS, type NeuromodulatoryState, type NeuromodulatorType } from "@/lib/types"

interface NeuromodulationCardProps {
  data: NeuromodulatoryState
}

const NEUROMODULATOR_COLORS: Record<NeuromodulatorType, string> = {
  dopamine: "var(--chart-1)",
  serotonin: "var(--chart-2)",
  norepinephrine: "var(--chart-3)",
  oxytocin: "var(--chart-4)",
  cortisol: "var(--chart-5)",
  endorphins: "var(--chart-6)",
  gaba: "var(--chart-8)",
}

export function NeuromodulationCard({ data }: NeuromodulationCardProps) {
  const t = useTranslations("Neuromodulation")
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            CRH: {Math.round(data.crhBuffer * 100)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {NEUROMODULATOR_KEYS.map((key) => {
          const level = data[key]
          const percent = Math.round(level.level * 100)

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t(key)}</span>
                <span className="font-medium">{percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <ValueBar percent={percent} color={NEUROMODULATOR_COLORS[key]} />
              </div>
            </div>
          )
        })}

        <div className="mt-2 grid grid-cols-2 gap-3 rounded-lg border border-border/50 p-3">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">{t("tonicDopamine")}</span>
            <p className="text-sm font-medium">{Math.round(data.dopamineDetail.tonicLevel * 100)}%</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">{t("phasicDopamine")}</span>
            <p className="text-sm font-medium">{Math.round(data.dopamineDetail.phasicLevel * 100)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
