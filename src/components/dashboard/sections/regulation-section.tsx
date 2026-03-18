import { fetchRegulationData } from "@/lib/data"
import { RegulationCard } from "../regulation-card"
import type { EmotionRegulationState } from "@/lib/types"

const DEFAULT_REGULATION: EmotionRegulationState = {
  activeStrategies: [],
  totalActivations: 0,
  totalBreakthroughs: 0,
}

export async function RegulationSection() {
  const data = await fetchRegulationData()

  return <RegulationCard data={data ?? DEFAULT_REGULATION} />
}
