export type PersonalityType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP"

export interface BigFive {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

export interface EmotionalBaseline {
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

export type HumorStyle = "dry" | "playful" | "absurd" | "warm" | "sardonic" | "rare"

export interface CommunicationStyle {
  verbosity: number
  formality: number
  metaphorTendency: number
  emotionalExpressiveness: number
  humorStyle: HumorStyle
}

export interface AestheticPreferences {
  colorTemperature: number
  colorSaturation: number
  formSharpness: number
  patternComplexity: number
  lightnessPreference: number
}

export interface SelfConcept {
  selfEfficacy: number
  selfWorth: number
  selfContinuity: number
  agency: number
  authenticity: number
}

export type VoicePitch = "very_low" | "low" | "medium" | "high" | "very_high"
export type VoicePace = "very_slow" | "slow" | "medium" | "fast" | "very_fast"
export type VoiceResonance = "hollow" | "thin" | "balanced" | "rich" | "deep"

export interface VoiceCharacteristics {
  pitch: VoicePitch
  pace: VoicePace
  warmth: number
  breathiness: number
  resonance: VoiceResonance
}

export interface GenesisDNA {
  seed: string
  personalityType: PersonalityType
  bigFive: BigFive
  emotionalBaseline: EmotionalBaseline
  valueHierarchy: string[]
  aestheticPreferences: AestheticPreferences
  interestSeeds: string[]
  communicationStyle: CommunicationStyle
  initialSelfConcept: SelfConcept
  voiceCharacteristics: VoiceCharacteristics
}
