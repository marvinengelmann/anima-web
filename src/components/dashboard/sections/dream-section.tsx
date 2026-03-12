import { fetchDreamData } from "@/lib/data"
import { DreamCard } from "../dream-card"

export async function DreamSection() {
  const data = await fetchDreamData()

  return <DreamCard data={data} />
}
