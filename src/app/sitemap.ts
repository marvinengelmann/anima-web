import type { MetadataRoute } from "next"

const BASE_URL = "https://anima.engelmann.technology"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          en: BASE_URL,
          de: `${BASE_URL}/de`,
        },
      },
    },
    {
      url: `${BASE_URL}/seed`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${BASE_URL}/seed`,
          de: `${BASE_URL}/de/seed`,
        },
      },
    },
  ]
}
