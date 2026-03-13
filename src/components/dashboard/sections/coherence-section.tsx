import { fetchCoherenceData } from "@/lib/data"
import { CoherenceGauge } from "../coherence-gauge"
import type { CoherenceState } from "@/lib/types"

const DEFAULT_COHERENCE: CoherenceState = {
  integrationScore: 0,
  fragmentationSources: [],
  regressionActive: false,
  regressionDepth: 0,
}

export async function CoherenceSection() {
  const data = await fetchCoherenceData()

  return <CoherenceGauge data={data ?? DEFAULT_COHERENCE} />
}
