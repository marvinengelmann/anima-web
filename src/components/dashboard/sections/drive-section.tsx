import { fetchDriveData } from "@/lib/data"
import { DriveChart } from "../drive-chart"

export async function DriveSection() {
  const state = await fetchDriveData()

  if (!state) return null

  return <DriveChart data={state} />
}
