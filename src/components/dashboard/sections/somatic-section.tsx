import { fetchSomaticData, computeSomaticAverage } from "@/lib/data"
import type { TimeRange } from "@/lib/types"
import { SomaticRadarChart } from "../somatic-radar-chart"

export async function SomaticSection({ range }: { range: TimeRange }) {
  const somatic = await fetchSomaticData(range)
  const average = computeSomaticAverage(somatic.history)

  return <SomaticRadarChart current={somatic.current} average={average} />
}
