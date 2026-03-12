import { fetchEmotionData, fetchSomaticData, buildTimeSeries, buildEvents } from "@/lib/data"
import type { TimeRange } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
    <Card className="flex flex-col">
      <div>
        <ResourceChart data={timeSeries} bare />
      </div>
      <Separator />
      <div className="flex flex-1 flex-col">
        <MomentumChart data={emotion.momentum} recentEvents={events} bare />
      </div>
    </Card>
  )
}
