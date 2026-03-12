"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"

interface RegisterBadgeProps {
  register: string
}

export function RegisterBadge({ register }: RegisterBadgeProps) {
  const t = useTranslations("Register")

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">{t("label")}:</span>
      <Badge variant="outline" className="text-xs">
        {register}
      </Badge>
    </div>
  )
}
