"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { faGlobe } from "@fortawesome/pro-light-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const nextLocale = locale === "en" ? "de" : "en"

  function handleToggle() {
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <FontAwesomeIcon icon={faGlobe} className="h-3 w-3" />
      {locale.toUpperCase()}
    </button>
  )
}
