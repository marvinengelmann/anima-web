"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"

interface LifecycleBadgeProps {
  event: string | null
}

export function LifecycleBadge({ event }: LifecycleBadgeProps) {
  const t = useTranslations("Lifecycle")

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">{t("label")}:</span>
      <Badge variant="outline" className="text-xs">
        {event ?? t("none")}
      </Badge>
    </div>
  )
}
