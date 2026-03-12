import { NextResponse } from "next/server"
import { redis } from "@/lib/db/redis"
import type { DriveState } from "@/lib/types"

export async function GET() {
  const state = await redis.get<DriveState>("working:drive:state")
  return NextResponse.json({ state })
}
