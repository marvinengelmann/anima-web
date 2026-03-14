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
import type { CoherenceState } from "@/lib/types"

interface CoherenceGaugeProps {
  data: CoherenceState
}

export function CoherenceGauge({ data }: CoherenceGaugeProps) {
  const t = useTranslations("Coherence")

  const scorePercent = Math.round(data.integrationScore * 100)

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <Badge variant={data.regressionActive ? "destructive" : "secondary"} className="text-xs">
            {t("regression")}: {data.regressionActive ? t("regressionActive") : t("regressionInactive")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("integrationScore")}</span>
            <span className="font-medium">{scorePercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

        {data.regressionActive && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("regressionDepth")}</span>
              <span className="font-medium">{Math.round(data.regressionDepth * 100)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-destructive/70 transition-all"
                style={{ width: `${Math.round(data.regressionDepth * 100)}%` }}
              />
            </div>
          </div>
        )}

        {data.fragmentationSources.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">{t("fragmentation")}</span>
            <div className="flex flex-wrap gap-1.5">
              {data.fragmentationSources.map((source) => (
                <Badge key={source} variant="outline" className="text-xs">
                  {source}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
