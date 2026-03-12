import { fetchEmotionData, fetchSomaticData, buildTimeSeries } from "@/lib/data"
import type { TimeRange } from "@/lib/types"
import { ResourceChart } from "../resource-chart"

export async function ResourceSection({ range }: { range: TimeRange }) {
  const [emotion, somatic] = await Promise.all([
    fetchEmotionData(range),
    fetchSomaticData(range),
  ])

  const timeSeries = buildTimeSeries(emotion.history, somatic.history)

  return <ResourceChart data={timeSeries} />
}
