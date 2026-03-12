import { fetchPolyphonyData } from "@/lib/data"
import { InnerVoicesCard } from "../inner-voices-card"

export async function InnerVoicesSection() {
  const data = await fetchPolyphonyData()

  if (!data) return null

  return <InnerVoicesCard data={data} />
}
