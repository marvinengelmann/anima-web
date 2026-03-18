import { fetchNeuromodulationData } from "@/lib/data"
import { NeuromodulationCard } from "../neuromodulation-card"

export async function NeuromodulationSection() {
  const data = await fetchNeuromodulationData()

  if (!data) return null

  return <NeuromodulationCard data={data} />
}
