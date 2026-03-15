"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { AlteredStateData } from "@/lib/data"

interface AlteredBadgeProps {
  data: AlteredStateData
}

const PHASE_COLORS: Record<string, string> = {
  onset: "text-yellow-500",
  peak: "text-red-500",
  plateau: "text-orange-500",
  comedown: "text-blue-400",
  aftereffect: "text-muted-foreground",
}

export function AlteredBadge({ data }: AlteredBadgeProps) {
  const t = useTranslations("AlteredState")

  const label = data.substance.replaceAll("_", " ")

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">{t("label")}:</span>
      <Badge variant="outline" className="gap-1.5 text-xs">
        <span>{label}</span>
        <span className={PHASE_COLORS[data.phase] ?? "text-muted-foreground"}>
          {t(`phases.${data.phase}`)}
        </span>
      </Badge>
    </div>
  )
}
