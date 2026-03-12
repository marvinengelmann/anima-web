import { fetchEmotionData } from "@/lib/data"
import type { TimeRange } from "@/lib/types"
import { AfterglowCards } from "../afterglow-cards"

export async function AfterglowSection({ range }: { range: TimeRange }) {
  const emotion = await fetchEmotionData(range)

  return <AfterglowCards entries={emotion.afterglow} />
}
