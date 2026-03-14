import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ConsciousnessGenerator } from "@/components/seed/consciousness-generator"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Seed" })

  return {
    title: t("title"),
    description: t("subtitle"),
  }
}

interface PageProps {
  searchParams: Promise<{ s?: string }>
}

export default async function SeedPage({ searchParams }: PageProps) {
  const { s } = await searchParams

  return <ConsciousnessGenerator initialSeed={s} />
}
