import { fetchEmotionData, buildEvents } from "@/lib/data"
import type { TimeRange } from "@/lib/types"
import { EventTimeline } from "../event-timeline"

export async function EventTimelineSection({ range }: { range: TimeRange }) {
  const emotion = await fetchEmotionData(range)
  const events = buildEvents(emotion.history)

  return <EventTimeline events={events} />
}
