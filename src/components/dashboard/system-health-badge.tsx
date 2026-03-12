"use client"

import { useTranslations } from "next-intl"

interface SystemHealthBadgeProps {
  status: string
}

export function SystemHealthBadge({ status }: SystemHealthBadgeProps) {
  const t = useTranslations("SystemHealth")

  const normalized = status.toLowerCase()

  const dotColor =
    normalized === "healthy" ? "bg-green-500" :
    normalized === "degraded" ? "bg-yellow-500" :
    normalized === "critical" ? "bg-red-500" :
    "bg-muted-foreground"

  const label =
    normalized === "healthy" ? t("healthy") :
    normalized === "degraded" ? t("degraded") :
    normalized === "critical" ? t("critical") :
    t("unknown")

  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-2 w-2 rounded-full ${dotColor}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
