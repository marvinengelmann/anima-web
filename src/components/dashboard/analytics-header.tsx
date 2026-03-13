import { useTranslations } from "next-intl"

export function AnalyticsHeader() {
  const t = useTranslations("Analytics")

  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-balance">
        {t("title")}
      </h2>
      <p className="mt-4 text-balance text-sm text-muted-foreground">
        {t("subtitle")}
      </p>
    </div>
  )
}
