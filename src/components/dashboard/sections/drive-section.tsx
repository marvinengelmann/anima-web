import { fetchDriveData } from "@/lib/data"
import { DriveChart } from "../drive-chart"
import type { DriveState } from "@/lib/types"

const DEFAULT_DRIVE: DriveState = {
  curiosity: { satiation: 0, frustration: 0, salience: 0 },
  connection: { satiation: 0, frustration: 0, salience: 0 },
  mastery: { satiation: 0, frustration: 0, salience: 0 },
  autonomy: { satiation: 0, frustration: 0, salience: 0 },
  expression: { satiation: 0, frustration: 0, salience: 0 },
  dominantDrive: "",
}

export async function DriveSection() {
  const state = await fetchDriveData()

  return <DriveChart data={state ?? DEFAULT_DRIVE} />
}
