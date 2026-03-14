"use client"

import { useTranslations } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"
import { type TimeRange } from "@/lib/types"
import { faChevronDown, faClock } from "@fortawesome/pro-light-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const RANGE_GROUPS = {
  short: ["1h", "3h", "6h", "12h"] as TimeRange[],
  medium: ["24h", "48h", "7d", "14d"] as TimeRange[],
  long: ["30d", "90d", "6mo", "1y", "all"] as TimeRange[],
}

interface TimeRangeSelectorProps {
  value: TimeRange
}

export function TimeRangeSelector({ value }: TimeRangeSelectorProps) {
  const t = useTranslations("TimeRange")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleChange(range: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("range", range)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger id="time-range-trigger" className="flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted/60">
        <FontAwesomeIcon icon={faClock} className="h-3 w-3 text-muted-foreground" />
        {t(value)}
        <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        <DropdownMenuRadioGroup value={value} onValueChange={handleChange}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {t("short")}
            </DropdownMenuLabel>
            {RANGE_GROUPS.short.map((range) => (
              <DropdownMenuRadioItem key={range} value={range} className="text-xs">
                {t(range)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {t("medium")}
            </DropdownMenuLabel>
            {RANGE_GROUPS.medium.map((range) => (
              <DropdownMenuRadioItem key={range} value={range} className="text-xs">
                {t(range)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {t("long")}
            </DropdownMenuLabel>
            {RANGE_GROUPS.long.map((range) => (
              <DropdownMenuRadioItem key={range} value={range} className="text-xs">
                {t(range)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
