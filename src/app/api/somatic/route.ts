import { NextRequest, NextResponse } from "next/server"
import { desc, gte } from "drizzle-orm"
import { db } from "@/lib/db/client"
import { redis } from "@/lib/db/redis"
import { somaticHistory } from "@/lib/db/schema"
import { getStartDate } from "@/lib/time-range"
import type { SomaticState } from "@/lib/types"

export async function GET(request: NextRequest) {
  const range = request.nextUrl.searchParams.get("range") ?? "24h"

  const [current, history] = await Promise.all([
    redis.get<SomaticState>("working:soma:current"),
    db
      .select({
        state: somaticHistory.state,
        trigger: somaticHistory.trigger,
        createdAt: somaticHistory.createdAt,
      })
      .from(somaticHistory)
      .where(gte(somaticHistory.createdAt, getStartDate(range)))
      .orderBy(desc(somaticHistory.createdAt))
      .limit(500),
  ])

  return NextResponse.json({
    current,
    history: history.map((row) => ({
      timestamp: row.createdAt.toISOString(),
      state: row.state as SomaticState,
      trigger: row.trigger,
    })),
  })
}
