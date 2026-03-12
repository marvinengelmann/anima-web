import { NextResponse } from "next/server"
import { redis } from "@/lib/db/redis"
import { SECONDARY_EMOTION_KEYS } from "@/lib/types"

interface SecondaryState {
  level: number
  isActive: boolean
  [key: string]: unknown
}

export async function GET() {
  const pipeline = redis.pipeline()
  for (const name of SECONDARY_EMOTION_KEYS) {
    pipeline.get(`working:emotion:${name}`)
  }

  const results = await pipeline.exec<(SecondaryState | null)[]>()

  const emotions = SECONDARY_EMOTION_KEYS.map((name, i) => {
    const state = results[i]
    return {
      name,
      level: state?.level ?? 0,
      isActive: state?.isActive ?? false,
    }
  })

  return NextResponse.json({ emotions })
}
