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

  const hasData = data.state || data.narrative || data.afterglow

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t("noData")}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          {data.state && (
            <Badge variant="secondary" className="text-xs">
              {t("state")}: {data.state}
            </Badge>
          )}
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

            {data.afterglow.emotionalResidue && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">{t("residue")}</span>
                <p className="text-sm">{data.afterglow.emotionalResidue}</p>
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
      </CardContent>
    </Card>
  )
}
