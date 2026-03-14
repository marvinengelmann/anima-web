import { fetchEmotionData, fetchSomaticData, buildTimeSeries, buildEvents } from "@/lib/data"
import type { TimeRange } from "@/lib/types"
import { ResourceChart } from "../resource-chart"
import { MomentumChart } from "../momentum-chart"

export async function ResourceMomentumSection({ range }: { range: TimeRange }) {
  const [emotion, somatic] = await Promise.all([
    fetchEmotionData(range),
    fetchSomaticData(range),
  ])

  const timeSeries = buildTimeSeries(emotion.history, somatic.history)
  const events = buildEvents(emotion.history)

  return (
    <>
      <ResourceChart data={timeSeries} />
      <MomentumChart data={emotion.momentum} recentEvents={events} />
    </>
  )
}
