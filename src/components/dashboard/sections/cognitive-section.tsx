import { fetchCognitiveData } from "@/lib/data"
import { CognitiveStatusCard } from "../cognitive-status-card"
import type { CognitiveStatusData } from "@/lib/types"

const DEFAULT_COGNITIVE: CognitiveStatusData = {
  cognitiveClarity: 0,
  cognitiveFatigue: 0,
  confidenceCalibration: 0,
  ruminationDetected: false,
  ruminationTopic: null,
  ruminationTicks: 0,
  complexDecisionCount: 0,
  attentionFocus: null,
}

export async function CognitiveSection() {
  const data = await fetchCognitiveData()

  return <CognitiveStatusCard data={data ?? DEFAULT_COGNITIVE} />
}
