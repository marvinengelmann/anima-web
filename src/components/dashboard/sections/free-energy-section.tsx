import { fetchFreeEnergyData } from "@/lib/data"
import { FreeEnergyCard } from "../free-energy-card"

export async function FreeEnergySection() {
  const data = await fetchFreeEnergyData()

  if (!data) return null

  return <FreeEnergyCard data={data} />
}
