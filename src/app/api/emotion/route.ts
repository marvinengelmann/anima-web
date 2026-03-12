import { NextRequest, NextResponse } from "next/server"
import { desc, gte } from "drizzle-orm"
import { db } from "@/lib/db/client"
import { redis } from "@/lib/db/redis"
import { emotionHistory } from "@/lib/db/schema"
import { getStartDate } from "@/lib/time-range"
import type { EmotionalState, MomentumVector, AfterglowEntry } from "@/lib/types"

export async function GET(request: NextRequest) {
  const range = request.nextUrl.searchParams.get("range") ?? "24h"

  const [current, momentum, afterglow, history] = await Promise.all([
    redis.get<EmotionalState>("working:emotion:current"),
    redis.get<MomentumVector>("working:emotion:momentum"),
    redis.get<AfterglowEntry[]>("working:emotion:afterglow"),
    db
      .select({
        state: emotionHistory.state,
        trigger: emotionHistory.trigger,
        createdAt: emotionHistory.createdAt,
      })
      .from(emotionHistory)
      .where(gte(emotionHistory.createdAt, getStartDate(range)))
      .orderBy(desc(emotionHistory.createdAt))
      .limit(500),
  ])

  return NextResponse.json({
    current,
    momentum,
    afterglow: afterglow ?? [],
    history: history.map((row) => ({
      timestamp: row.createdAt.toISOString(),
      state: row.state as EmotionalState,
      trigger: row.trigger,
    })),
  })
}
