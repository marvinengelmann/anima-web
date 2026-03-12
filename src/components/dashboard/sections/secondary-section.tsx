import { fetchSecondaryData } from "@/lib/data"
import { SecondaryEmotionsChart } from "../secondary-emotions-chart"

export async function SecondarySection() {
  const emotions = await fetchSecondaryData()

  return <SecondaryEmotionsChart data={emotions} />
}
