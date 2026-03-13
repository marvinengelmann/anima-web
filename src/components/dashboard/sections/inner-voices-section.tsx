import { fetchPolyphonyData } from "@/lib/data"
import { InnerVoicesCard } from "../inner-voices-card"
import type { PolyphonyState } from "@/lib/types"

const DEFAULT_POLYPHONY: PolyphonyState = {
  activeVoices: [],
  dominantVoice: "",
  tensionLevel: 0,
  utterances: [],
}

export async function InnerVoicesSection() {
  const data = await fetchPolyphonyData()

  return <InnerVoicesCard data={data ?? DEFAULT_POLYPHONY} />
}
