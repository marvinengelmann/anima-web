import { fetchTimelineEvents } from "@/lib/data"
import type { TimeRange } from "@/lib/types"
import { EventTimeline } from "../event-timeline"

export async function EventTimelineSection({ range }: { range: TimeRange }) {
  const events = await fetchTimelineEvents(range)

  return <EventTimeline events={events} />
}
