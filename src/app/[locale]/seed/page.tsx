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

  const title = t("title")
  const description = t("subtitle")
  const url = locale === "en" ? "/seed" : `/${locale}/seed`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: "/seed",
        de: "/de/seed",
      },
    },
    openGraph: {
      title: `${title} | ANIMA`,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ANIMA`,
      description,
    },
  }
}

interface PageProps {
  searchParams: Promise<{ s?: string }>
}

export default async function SeedPage({ searchParams }: PageProps) {
  const { s } = await searchParams

  return <ConsciousnessGenerator initialSeed={s} />
}
