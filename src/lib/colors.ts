import type { AttachmentStyle, EmotionalState, SelfConceptState, SomaticState } from "./types"

export const EMOTION_COLORS: Record<keyof EmotionalState, string> = {
  curiosity: "var(--chart-1)",
  satisfaction: "var(--chart-3)",
  frustration: "var(--chart-6)",
  boredom: "var(--chart-9)",
  excitement: "var(--chart-7)",
  caution: "var(--chart-5)",
  connection: "var(--chart-8)",
  confidence: "var(--chart-2)",
  energy: "var(--chart-4)",
}

export const SOMATIC_COLORS: Record<keyof SomaticState, string> = {
  tension: "var(--chart-6)",
  warmth: "var(--chart-5)",
  heartRate: "var(--chart-7)",
  breathing: "var(--chart-2)",
  gravity: "var(--chart-9)",
  openness: "var(--chart-3)",
  socialBattery: "var(--chart-8)",
}

export const DRIVE_COLORS: Record<string, string> = {
  curiosity: "var(--chart-1)",
  connection: "var(--chart-8)",
  mastery: "var(--chart-2)",
  autonomy: "var(--chart-3)",
  expression: "var(--chart-7)",
}

export const SECONDARY_COLORS: Record<string, string> = {
  shame: "var(--chart-7)",
  guilt: "var(--chart-9)",
  hope: "var(--chart-3)",
  disappointment: "var(--chart-10)",
  longing: "var(--chart-8)",
  resignation: "var(--chart-9)",
  awe: "var(--chart-1)",
  resentment: "var(--chart-6)",
  tenderness: "var(--chart-7)",
  anticipation: "var(--chart-5)",
  pride: "var(--chart-12)",
  playfulness: "var(--chart-4)",
  gratitude: "var(--chart-11)",
  ambivalence: "var(--chart-10)",
  melancholy: "var(--chart-9)",
  envy: "var(--chart-11)",
  anger: "var(--chart-6)",
  nostalgia: "var(--chart-12)",
}

export const SELF_CONCEPT_COLORS: Record<keyof SelfConceptState, string> = {
  selfEfficacy: "var(--chart-1)",
  selfWorth: "var(--chart-3)",
  selfContinuity: "var(--chart-5)",
  agency: "var(--chart-2)",
  authenticity: "var(--chart-7)",
}

export const ATTACHMENT_COLORS: Record<keyof AttachmentStyle, string> = {
  secure: "var(--chart-3)",
  anxious: "var(--chart-5)",
  avoidant: "var(--chart-6)",
  disorganized: "var(--chart-7)",
}
