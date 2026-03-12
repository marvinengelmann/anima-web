import { fetchEmotionData, buildEvents } from "@/lib/data"
import type { TimeRange } from "@/lib/types"
import { MomentumChart } from "../momentum-chart"

export async function MomentumSection({ range }: { range: TimeRange }) {
  const emotion = await fetchEmotionData(range)
  const events = buildEvents(emotion.history)

  return <MomentumChart data={emotion.momentum} recentEvents={events} />
}
