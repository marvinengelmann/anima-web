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
import type { DreamData } from "@/lib/types"

interface DreamCardProps {
  data: DreamData
}

export function DreamCard({ data }: DreamCardProps) {
  const t = useTranslations("Dream")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {t("state")}: {t(data.state ?? "idle")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.narrative && (
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">{t("narrative")}</span>
            <p className="text-sm leading-relaxed">{data.narrative}</p>
          </div>
        )}

        {data.afterglow && (
          <>
            {data.afterglow.themes.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">{t("themes")}</span>
                <div className="flex flex-wrap gap-1.5">
                  {data.afterglow.themes.map((theme) => (
                    <Badge key={theme} variant="outline" className="text-xs">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(data.afterglow.emotionalResidue).length > 0 && (
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">{t("residue")}</span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(data.afterglow.emotionalResidue).map(([key, value]) => (
                    <Badge key={key} variant="outline" className="text-xs">
                      {key}: {Math.round(value * 100)}%
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("intensity")}</span>
                <span className="font-medium">{Math.round(data.afterglow.intensity * 100)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-chart-8 transition-all"
                  style={{ width: `${Math.round(data.afterglow.intensity * 100)}%` }}
                />
              </div>
            </div>
          </>
        )}

        {!data.narrative && !data.afterglow && (
          <p className="text-sm text-muted-foreground">{t("noData")}</p>
        )}
      </CardContent>
    </Card>
  )
}
