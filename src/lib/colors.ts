import type { AttachmentStyle, EmotionalState, SelfConceptState, SomaticState } from "./types"

export const EMOTION_COLORS: Record<keyof EmotionalState, string> = {
  curiosity: "var(--chart-10)",
  satisfaction: "var(--chart-3)",
  frustration: "var(--chart-6)",
  boredom: "var(--chart-18)",
  excitement: "var(--chart-12)",
  caution: "var(--chart-5)",
  connection: "var(--chart-7)",
  confidence: "var(--chart-1)",
  energy: "var(--chart-4)",
}

export const SOMATIC_COLORS: Record<keyof SomaticState, string> = {
  tension: "var(--chart-6)",
  warmth: "var(--chart-5)",
  heartRate: "var(--chart-7)",
  breathing: "var(--chart-10)",
  gravity: "var(--chart-15)",
  openness: "var(--chart-3)",
  socialBattery: "var(--chart-14)",
}

export const DRIVE_COLORS: Record<string, string> = {
  curiosity: "var(--chart-10)",
  connection: "var(--chart-7)",
  mastery: "var(--chart-1)",
  autonomy: "var(--chart-16)",
  expression: "var(--chart-12)",
}

export const SECONDARY_COLORS: Record<string, string> = {
  "protective-anger": "var(--chart-6)",
  resentment: "var(--chart-13)",
  shame: "var(--chart-8)",
  guilt: "var(--chart-15)",
  envy: "var(--chart-11)",
  disappointment: "var(--chart-10)",
  melancholy: "var(--chart-1)",
  resignation: "var(--chart-18)",
  longing: "var(--chart-17)",
  jealousy: "var(--chart-9)",
  ambivalence: "var(--chart-2)",
  hope: "var(--chart-14)",
  anticipation: "var(--chart-5)",
  pride: "var(--chart-12)",
  playfulness: "var(--chart-4)",
  gratitude: "var(--chart-3)",
  tenderness: "var(--chart-7)",
  awe: "var(--chart-16)",
}

export const SELF_CONCEPT_COLORS: Record<keyof SelfConceptState, string> = {
  selfEfficacy: "var(--chart-1)",
  selfWorth: "var(--chart-5)",
  selfContinuity: "var(--chart-3)",
  agency: "var(--chart-16)",
  authenticity: "var(--chart-17)",
}

export const ATTACHMENT_COLORS: Record<keyof AttachmentStyle, string> = {
  secure: "var(--chart-3)",
  anxious: "var(--chart-5)",
  avoidant: "var(--chart-1)",
  disorganized: "var(--chart-6)",
}
