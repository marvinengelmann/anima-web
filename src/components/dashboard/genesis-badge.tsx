"use client"

import { faDna } from "@fortawesome/pro-light-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/navigation"

interface MbtiBadgeProps {
  personalityType: string
}

export function MbtiBadge({ personalityType }: MbtiBadgeProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">MBTI:</span>
      <Badge variant="outline" className="font-mono text-xs tracking-wider">
        {personalityType}
      </Badge>
    </div>
  )
}

interface SeedBadgeProps {
  seed: string
}

export function SeedBadge({ seed }: SeedBadgeProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">Seed:</span>
      <Link
        href={`/seed?s=${seed}`}
        className="flex items-center gap-1.5 rounded-full border border-border/50 px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
      >
        <FontAwesomeIcon icon={faDna} className="h-3 w-3" />
        <span className="font-mono">{seed}</span>
      </Link>
    </div>
  )
}
