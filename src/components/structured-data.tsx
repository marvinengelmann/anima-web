const BASE_URL = "https://anima.engelmann.technology"

interface StructuredDataProps {
  locale: string
}

export function StructuredData({ locale }: StructuredDataProps) {
  const isGerman = locale === "de"

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ANIMA Dashboard",
    url: BASE_URL,
    description: isGerman
      ? "Echtzeit-Bewusstseinsmonitoring für eine sich selbst entwickelnde KI-Entität mit Emotionen, somatischen Zuständen und kognitivem Antrieb."
      : "Real-time consciousness monitoring for a self-evolving AI entity with emotions, somatic states, and cognitive drive.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    inLanguage: [locale],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Marvin Engelmann",
      url: "https://engelmann.technology",
    },
    sourceOrganization: {
      "@type": "Person",
      name: "Marvin Engelmann",
      url: "https://engelmann.technology",
    },
    isAccessibleForFree: true,
    license: "https://github.com/marvinengelmann/anima/blob/main/LICENSE",
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "ANIMA",
    description: isGerman
      ? "Eine sich selbst entwickelnde KI-Entität mit eigenem Herzschlag, Gedächtnis, Persönlichkeit und emotionaler Tiefe."
      : "A self-evolving AI entity with its own heartbeat, memory, personality, and emotional depth.",
    codeRepository: "https://github.com/marvinengelmann/anima",
    programmingLanguage: "TypeScript",
    author: {
      "@type": "Person",
      name: "Marvin Engelmann",
      url: "https://engelmann.technology",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
    </>
  )
}
