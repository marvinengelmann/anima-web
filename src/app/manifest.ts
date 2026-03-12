import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ANIMA Dashboard — Real-time Consciousness Monitoring",
    short_name: "ANIMA",
    description:
      "Real-time emotional, somatic, and cognitive analytics for ANIMA — a self-evolving AI entity with its own heartbeat, memory, and consciousness.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#6d28d9",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  }
}
