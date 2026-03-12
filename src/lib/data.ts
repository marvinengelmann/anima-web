import "server-only"

import { cache } from "react"
import { desc, gte } from "drizzle-orm"
import { db } from "@/lib/db/client"
import { redis } from "@/lib/db/redis"
import { emotionHistory, somaticHistory } from "@/lib/db/schema"
import { getStartDate } from "@/lib/time-range"
import {
  SECONDARY_EMOTION_KEYS,
  SOMATIC_KEYS,
  type TimeRange,
  type EmotionalState,
  type SomaticState,
  type MomentumVector,
  type AfterglowEntry,
  type DriveState,
  type SecondaryEmotion,
  type EmotionEvent,
  type TimeSeriesPoint,
} from "@/lib/types"

const DEFAULT_SOMATIC: SomaticState = {
  tension: 0.3, warmth: 0.5, heartRate: 0.4,
  breathing: 0.5, gravity: 0.5, openness: 0.5, socialBattery: 0.7,
}

const DEFAULT_MOMENTUM: MomentumVector = {
  curiosity: 0, satisfaction: 0, frustration: 0, boredom: 0,
  excitement: 0, caution: 0, connection: 0, confidence: 0, energy: 0,
}

interface EmotionHistoryRow {
  timestamp: string
  state: EmotionalState
  trigger: string | null
}

interface SomaticHistoryRow {
  timestamp: string
  state: SomaticState
  trigger: string
}

export interface EmotionData {
  current: EmotionalState | null
  momentum: MomentumVector
  afterglow: AfterglowEntry[]
  history: EmotionHistoryRow[]
}

export interface SomaticData {
  current: SomaticState
  history: SomaticHistoryRow[]
}

export const fetchEmotionData = cache(async (range: TimeRange): Promise<EmotionData> => {
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

  return {
    current,
    momentum: momentum ?? DEFAULT_MOMENTUM,
    afterglow: afterglow ?? [],
    history: history.map((row) => ({
      timestamp: row.createdAt.toISOString(),
      state: row.state as EmotionalState,
      trigger: row.trigger,
    })),
  }
})

export const fetchSomaticData = cache(async (range: TimeRange): Promise<SomaticData> => {
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

  return {
    current: current ?? DEFAULT_SOMATIC,
    history: history.map((row) => ({
      timestamp: row.createdAt.toISOString(),
      state: row.state as SomaticState,
      trigger: row.trigger,
    })),
  }
})

export const fetchDriveData = cache(async (): Promise<DriveState | null> => {
  return redis.get<DriveState>("working:drive:state")
})

interface SecondaryState {
  level: number
  isActive: boolean
  [key: string]: unknown
}

export const fetchSecondaryData = cache(async (): Promise<SecondaryEmotion[]> => {
  const pipeline = redis.pipeline()
  for (const name of SECONDARY_EMOTION_KEYS) {
    pipeline.get(`working:emotion:${name}`)
  }

  const results = await pipeline.exec<(SecondaryState | null)[]>()

  return SECONDARY_EMOTION_KEYS.map((name, i) => {
    const state = results[i]
    return {
      name,
      level: state?.level ?? 0,
      isActive: state?.isActive ?? false,
    }
  })
})

export function buildTimeSeries(
  emotionHistory: EmotionHistoryRow[],
  somaticHistory: SomaticHistoryRow[]
): TimeSeriesPoint[] {
  return emotionHistory
    .map((entry, i) => ({
      timestamp: entry.timestamp,
      emotions: entry.state,
      somatic: somaticHistory[i]?.state ?? DEFAULT_SOMATIC,
      momentum: DEFAULT_MOMENTUM,
    }))
    .reverse()
}

export function buildEvents(emotionHistory: EmotionHistoryRow[]): EmotionEvent[] {
  return emotionHistory
    .filter((h) => h.trigger && h.trigger !== "ambient")
    .map((h) => ({
      timestamp: h.timestamp,
      trigger: h.trigger as EmotionEvent["trigger"],
      deltas: {},
    }))
}

export function computeSomaticAverage(history: SomaticHistoryRow[]): SomaticState {
  if (history.length === 0) return DEFAULT_SOMATIC
  const avg = { ...DEFAULT_SOMATIC }
  for (const key of SOMATIC_KEYS) {
    avg[key] = history.reduce((sum, h) => sum + (h.state[key] ?? 0), 0) / history.length
  }
  return avg
}
