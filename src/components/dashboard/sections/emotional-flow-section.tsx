import { fetchEmotionData, fetchSomaticData, buildTimeSeries } from "@/lib/data"
import type { TimeRange } from "@/lib/types"
import { EmotionalFlowChart } from "../emotional-flow-chart"

export async function EmotionalFlowSection({ range }: { range: TimeRange }) {
  const [emotion, somatic] = await Promise.all([
    fetchEmotionData(range),
    fetchSomaticData(range),
  ])

  const timeSeries = buildTimeSeries(emotion.history, somatic.history)

  return <EmotionalFlowChart data={timeSeries} />
}
