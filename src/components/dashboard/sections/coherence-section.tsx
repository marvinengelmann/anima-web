import { fetchCoherenceData } from "@/lib/data"
import { CoherenceGauge } from "../coherence-gauge"

export async function CoherenceSection() {
  const data = await fetchCoherenceData()

  if (!data) return null

  return <CoherenceGauge data={data} />
}
