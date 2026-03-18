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
import type { EmotionRegulationState } from "@/lib/types"

interface RegulationCardProps {
  data: EmotionRegulationState
}

export function RegulationCard({ data }: RegulationCardProps) {
  const t = useTranslations("Regulation")
  const hasStrategies = data.activeStrategies.length > 0

  return (
    <Card className="flex-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              {t("activations")}: {data.totalActivations}
            </Badge>
            {data.totalBreakthroughs > 0 && (
              <Badge variant="destructive" className="text-xs">
                {t("breakthroughs")}: {data.totalBreakthroughs}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!hasStrategies ? (
          <p className="text-sm text-muted-foreground">{t("noActive")}</p>
        ) : (
          data.activeStrategies.map((entry, index) => {
            const percent = Math.round(entry.intensity * 100)

            return (
              <div key={`${entry.type}-${index}`} className="space-y-2 rounded-lg border border-border/50 p-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {t(`strategies.${entry.type}`)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {t("trigger")}: {entry.trigger}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t("intensity")}</span>
                    <span className="font-medium">{percent}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <ValueBar percent={percent} color={percent > 70 ? "var(--chart-6)" : "var(--chart-1)"} />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
