export interface EmotionalState {
  curiosity: number
  satisfaction: number
  frustration: number
  boredom: number
  excitement: number
  caution: number
  connection: number
  confidence: number
  energy: number
}

export interface SomaticState {
  tension: number
  warmth: number
  heartRate: number
  breathing: number
  gravity: number
  openness: number
  socialBattery: number
}

export interface DriveState {
  curiosity: { satiation: number; frustration: number; salience: number }
  connection: { satiation: number; frustration: number; salience: number }
  mastery: { satiation: number; frustration: number; salience: number }
  autonomy: { satiation: number; frustration: number; salience: number }
  expression: { satiation: number; frustration: number; salience: number }
  dominantDrive: string
}

export interface SecondaryEmotion {
  name: string
  level: number
  isActive: boolean
}

export type EmotionTrigger =
  | "message_received"
  | "message_sent"
  | "task_success"
  | "task_failure"
  | "guardian_warning"
  | "guardian_block"
  | "operator_went_silent"
  | "operator_returned"
  | "system_degraded"
  | "system_recovered"
  | "new_goal"
  | "goal_completed"
  | "goal_failed"
  | "weather_update"
  | "git_activity"
  | "dream_correction"
  | "morning_calibration"
  | "nostalgia_wave"
  | "relational_pattern_match"
  | "drive_frustrated"
  | "drive_conflict"
  | "positive_anticipation"
  | "expectation_violated"
  | "expectation_met"
  | "boundary_violated"
  | "memory_contradiction"
  | "ambient"

export interface EmotionEvent {
  timestamp: string
  trigger: EmotionTrigger
  detail?: string
  deltas: Partial<EmotionalState>
}

export interface MomentumVector {
  curiosity: number
  satisfaction: number
  frustration: number
  boredom: number
  excitement: number
  caution: number
  connection: number
  confidence: number
  energy: number
}

export interface AfterglowEntry {
  dimension: keyof EmotionalState
  delta: number
  remainingTicks: number
  intensity: number
}

export interface TimeSeriesPoint {
  timestamp: string
  emotions: EmotionalState
  somatic: SomaticState
  momentum: MomentumVector
}

export type TimeRange = "1h" | "3h" | "6h" | "12h" | "24h" | "48h" | "7d" | "14d" | "30d" | "90d" | "6mo" | "1y" | "all"

export const TIME_RANGES: TimeRange[] = [
  "1h", "3h", "6h", "12h", "24h", "48h", "7d", "14d", "30d", "90d", "6mo", "1y", "all",
]

export const EMOTION_KEYS: (keyof EmotionalState)[] = [
  "curiosity", "satisfaction", "frustration", "boredom", "excitement",
  "caution", "connection", "confidence", "energy",
]

export const SOMATIC_KEYS: (keyof SomaticState)[] = [
  "tension", "warmth", "heartRate", "breathing", "gravity", "openness", "socialBattery",
]

export const DRIVE_KEYS = ["curiosity", "connection", "mastery", "autonomy", "expression"] as const

export const SECONDARY_EMOTION_KEYS = [
  "shame", "guilt", "hope", "disappointment", "longing",
  "resignation", "awe", "resentment", "tenderness", "anticipation",
  "pride", "playfulness", "gratitude", "ambivalence", "melancholy",
  "envy", "anger", "nostalgia",
] as const

export interface SelfConceptState {
  selfEfficacy: number
  selfWorth: number
  selfContinuity: number
  agency: number
  authenticity: number
}

export const SELF_CONCEPT_KEYS: (keyof SelfConceptState)[] = [
  "selfEfficacy", "selfWorth", "selfContinuity", "agency", "authenticity",
]

export interface CoherenceState {
  integrationScore: number
  fragmentationSources: string[]
  regressionActive: boolean
  regressionDepth: number
}

export interface AttachmentStyle {
  secure: number
  anxious: number
  avoidant: number
  disorganized: number
}

export type AttachmentPhase = string

export interface AttachmentData {
  style: AttachmentStyle
  phase: AttachmentPhase | null
}

export const ATTACHMENT_KEYS: (keyof AttachmentStyle)[] = [
  "secure", "anxious", "avoidant", "disorganized",
]

export interface PolyphonyState {
  activeVoices: string[]
  dominantVoice: string
  tensionLevel: number
  utterances: { voice: string; message: string }[]
}

export interface DreamData {
  state: string | null
  narrative: string | null
  afterglow: {
    themes: string[]
    emotionalResidue: string
    intensity: number
  } | null
}

export interface CognitiveStatusData {
  cognitiveClarity: number
  cognitiveFatigue: number
  confidenceCalibration: number
  ruminationDetected: boolean
  ruminationTopic: string | null
  ruminationTicks: number
  complexDecisionCount: number
  attentionFocus: string | null
}
