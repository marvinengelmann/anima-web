import type { Metadata } from "next"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { ThemeProvider } from "next-themes"
import PlausibleProvider from "next-plausible"
import { routing } from "@/i18n/routing"
import { StructuredData } from "@/components/structured-data"
import { config } from "@fortawesome/fontawesome-svg-core"
import "../globals.css"

config.autoAddCss = false

const BASE_URL = "https://anima.engelmann.technology"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
})

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  const title = t("Metadata.title")
  const description = t("Metadata.description")

  return {
    title: {
      default: title,
      template: `%s | ANIMA`,
    },
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: locale === "en" ? "/" : `/${locale}`,
      languages: {
        en: "/",
        de: "/de",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "de" ? "de_DE" : "en_US",
      alternateLocale: locale === "de" ? "en_US" : "de_DE",
      url: locale === "en" ? BASE_URL : `${BASE_URL}/${locale}`,
      siteName: "ANIMA",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    authors: [{ name: "Marvin Engelmann", url: "https://engelmann.technology" }],
    creator: "Marvin Engelmann",
    publisher: "Marvin Engelmann",
    keywords:
      locale === "de"
        ? [
            "KI",
            "Künstliche Intelligenz",
            "Bewusstsein",
            "Emotionen",
            "Dashboard",
            "Echtzeit-Analytik",
            "ANIMA",
            "Selbstevolution",
            "Affektsystem",
            "Somatik",
          ]
        : [
            "AI",
            "Artificial Intelligence",
            "Consciousness",
            "Emotions",
            "Dashboard",
            "Real-time Analytics",
            "ANIMA",
            "Self-evolving",
            "Affect System",
            "Somatic",
          ],
    category: "technology",
    applicationName: "ANIMA",
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        <StructuredData locale={locale} />
      </head>
      <body className="antialiased">
        <PlausibleProvider domain="anima.engelmann.technology">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </ThemeProvider>
        </PlausibleProvider>
      </body>
    </html>
  )
}
