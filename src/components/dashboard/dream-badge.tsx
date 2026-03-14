"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { DreamData } from "@/lib/types"

interface DreamBadgeProps {
  data: DreamData
}

export function DreamBadge({ data }: DreamBadgeProps) {
  const t = useTranslations("Dream")

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">{t("title")}:</span>
      <Badge variant="outline" className="text-xs">
        {t(data.state ?? "idle")}
      </Badge>
      {data.afterglow && (
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {Math.round(data.afterglow.intensity * 100)}%
        </span>
      )}
    </div>
  )
}
