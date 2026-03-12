import { fetchCognitiveData } from "@/lib/data"
import { CognitiveStatusCard } from "../cognitive-status-card"

export async function CognitiveSection() {
  const data = await fetchCognitiveData()

  if (!data) return null

  return <CognitiveStatusCard data={data} />
}
