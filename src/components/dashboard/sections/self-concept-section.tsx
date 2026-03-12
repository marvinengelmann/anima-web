import { fetchSelfConceptData } from "@/lib/data"
import { SelfConceptChart } from "../self-concept-chart"

export async function SelfConceptSection() {
  const data = await fetchSelfConceptData()

  if (!data) return null

  return <SelfConceptChart data={data} />
}
