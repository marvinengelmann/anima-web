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
  type SelfConceptState,
  type CoherenceState,
  type AttachmentData,
  type AttachmentStyle,
  type PolyphonyState,
  type DreamData,
  type CognitiveStatusData,
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

export const fetchSelfConceptData = cache(async (): Promise<SelfConceptState | null> => {
  return redis.get<SelfConceptState>("working:psyche:current")
})

export const fetchCoherenceData = cache(async (): Promise<CoherenceState | null> => {
  return redis.get<CoherenceState>("working:coherence:state")
})

export const fetchAttachmentData = cache(async (): Promise<AttachmentData> => {
  const [style, phase] = await Promise.all([
    redis.get<AttachmentStyle>("working:attachment:current"),
    redis.get<string>("working:attachment:phase"),
  ])

  return {
    style: style ?? { secure: 0, anxious: 0, avoidant: 0, disorganized: 0 },
    phase: phase ?? null,
  }
})

export const fetchPolyphonyData = cache(async (): Promise<PolyphonyState | null> => {
  return redis.get<PolyphonyState>("working:polyphony:lastDialog")
})

export const fetchDreamData = cache(async (): Promise<DreamData> => {
  const [state, narrative, afterglow] = await Promise.all([
    redis.get<string>("working:dream:state"),
    redis.get<string>("working:dream:narrative"),
    redis.get<DreamData["afterglow"]>("working:dream:afterglow"),
  ])

  return {
    state: state ?? null,
    narrative: narrative ?? null,
    afterglow: afterglow ?? null,
  }
})

interface MetacognitionState {
  cognitiveClarity: number
  cognitiveFatigue: number
  confidenceCalibration: number
  ruminationDetected: boolean
  ruminationTopic: string | null
  ruminationTicks: number
  complexDecisionCount: number
}

export const fetchCognitiveData = cache(async (): Promise<CognitiveStatusData | null> => {
  const [meta, attention] = await Promise.all([
    redis.get<MetacognitionState>("working:metacognition:state"),
    redis.get<string>("working:cognition:attention"),
  ])

  if (!meta) return null

  return {
    ...meta,
    attentionFocus: attention ?? null,
  }
})

export const fetchLifecyclePhase = cache(async (): Promise<string | null> => {
  return redis.get<string>("working:lifecycle:event")
})

export const fetchSystemHealth = cache(async (): Promise<string | null> => {
  const result = await redis.get<{ overall: string }>("working:health:lastCheck")
  return result?.overall ?? null
})

export const fetchRegisterData = cache(async (): Promise<string | null> => {
  return redis.get<string>("working:communication:register")
})

export interface GenesisData {
  seed: string
  personalityType: string
}

export const fetchGenesisData = cache(async (): Promise<GenesisData | null> => {
  const record = await redis.get<{ seed: string; dna: { personalityType: string } }>("working:genesis:record")
  if (!record) return null
  return { seed: record.seed, personalityType: record.dna.personalityType }
})
