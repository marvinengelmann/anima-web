import { fetchSelfConceptData } from "@/lib/data"
import { SelfConceptChart } from "../self-concept-chart"
import type { SelfConceptState } from "@/lib/types"

const DEFAULT_SELF_CONCEPT: SelfConceptState = {
  selfEfficacy: 0,
  selfWorth: 0,
  selfContinuity: 0,
  agency: 0,
  authenticity: 0,
}

export async function SelfConceptSection() {
  const data = await fetchSelfConceptData()

  return <SelfConceptChart data={data ?? DEFAULT_SELF_CONCEPT} />
}
