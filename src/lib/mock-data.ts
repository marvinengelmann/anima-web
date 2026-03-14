import {
  type TimeRange,
  type TimeSeriesPoint,
  type EmotionalState,
  type SomaticState,
  type MomentumVector,
  type DriveState,
  type SecondaryEmotion,
  type EmotionEvent,
  type EmotionTrigger,
  type AfterglowEntry,
} from "./types"

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value))
}

function drift(current: number, target: number, rate: number): number {
  return current + (target - current) * rate
}

function noise(amplitude: number): number {
  return (Math.random() - 0.5) * 2 * amplitude
}

const RANGE_CONFIG: Record<TimeRange, { points: number; intervalMs: number }> = {
  "24h": { points: 96,  intervalMs: 15 * 60 * 1000 },
  "48h": { points: 96,  intervalMs: 30 * 60 * 1000 },
  "7d":  { points: 168, intervalMs: 60 * 60 * 1000 },
  "14d": { points: 168, intervalMs: 2 * 60 * 60 * 1000 },
  "30d": { points: 180, intervalMs: 4 * 60 * 60 * 1000 },
  "90d": { points: 180, intervalMs: 12 * 60 * 60 * 1000 },
  "6mo": { points: 180, intervalMs: 24 * 60 * 60 * 1000 },
  "1y":  { points: 180, intervalMs: 2 * 24 * 60 * 60 * 1000 },
  "all": { points: 200, intervalMs: 3 * 24 * 60 * 60 * 1000 },
}

function getPointCount(range: TimeRange): number {
  return RANGE_CONFIG[range].points
}

function getIntervalMs(range: TimeRange): number {
  return RANGE_CONFIG[range].intervalMs
}

function generateEmotionBaseline(): EmotionalState {
  return {
    curiosity: 0.5 + noise(0.15),
    satisfaction: 0.5 + noise(0.1),
    frustration: 0.3 + noise(0.1),
    boredom: 0.3 + noise(0.1),
    excitement: 0.4 + noise(0.15),
    caution: 0.4 + noise(0.1),
    connection: 0.5 + noise(0.15),
    confidence: 0.5 + noise(0.1),
    energy: 0.7 + noise(0.1),
  }
}

function computeSomatic(emotions: EmotionalState): SomaticState {
  return {
    tension: clamp(0.3 + 0.4 * emotions.frustration + 0.2 * emotions.caution - 0.2 * emotions.satisfaction),
    warmth: clamp(0.5 + 0.3 * emotions.connection - 0.1 * emotions.frustration + 0.1 * emotions.satisfaction),
    heartRate: clamp(0.4 + 0.3 * emotions.excitement + 0.2 * emotions.frustration - 0.1 * emotions.boredom),
    breathing: clamp(0.5 - 0.2 * emotions.frustration + 0.2 * emotions.satisfaction + 0.1 * emotions.confidence),
    gravity: clamp(0.5 + 0.2 * emotions.boredom - 0.2 * emotions.excitement + 0.1 * emotions.caution),
    openness: clamp(0.5 + 0.2 * emotions.curiosity + 0.2 * emotions.connection - 0.2 * emotions.caution),
    socialBattery: clamp(0.7 + noise(0.15)),
  }
}

function computeMomentum(prev: EmotionalState, curr: EmotionalState): MomentumVector {
  const keys = Object.keys(prev) as (keyof EmotionalState)[]
  const momentum = {} as MomentumVector
  for (const key of keys) {
    momentum[key] = clamp((curr[key] - prev[key]) * 5, -1, 1)
  }
  return momentum
}

export function generateTimeSeries(range: TimeRange, seed?: number): TimeSeriesPoint[] {
  if (seed !== undefined) {
    // deterministic-ish
  }

  const points = getPointCount(range)
  const interval = getIntervalMs(range)
  const now = Date.now()
  const startTime = now - points * interval

  const baseline = generateEmotionBaseline()
  const result: TimeSeriesPoint[] = []
  let current = { ...baseline }
  let socialBattery = 0.75

  for (let i = 0; i < points; i++) {
    const t = i / points
    const dayPhase = Math.sin(t * Math.PI * 2)
    const isActive = Math.random() > 0.3

    const target: EmotionalState = {
      curiosity: clamp(baseline.curiosity + 0.15 * dayPhase + noise(0.05)),
      satisfaction: clamp(baseline.satisfaction + 0.1 * Math.sin(t * 4) + noise(0.04)),
      frustration: clamp(baseline.frustration + (isActive ? noise(0.08) : -0.05)),
      boredom: clamp(baseline.boredom + (isActive ? -0.1 : 0.15) + noise(0.03)),
      excitement: clamp(baseline.excitement + 0.2 * dayPhase + noise(0.06)),
      caution: clamp(baseline.caution + noise(0.04)),
      connection: clamp(baseline.connection + (isActive ? 0.1 : -0.08) + noise(0.04)),
      confidence: clamp(baseline.confidence + 0.05 * Math.sin(t * 3) + noise(0.03)),
      energy: clamp(0.8 - 0.3 * (1 - dayPhase) / 2 + noise(0.04)),
    }

    const driftRate = 0.15 + noise(0.05)
    const keys = Object.keys(current) as (keyof EmotionalState)[]
    const prev = { ...current }
    for (const key of keys) {
      current[key] = clamp(drift(current[key], target[key], Math.abs(driftRate)) + noise(0.02))
    }

    if (isActive) {
      socialBattery = clamp(socialBattery - 0.01 + noise(0.005))
    } else {
      socialBattery = clamp(socialBattery + 0.02 + noise(0.005))
    }

    const somatic = computeSomatic(current)
    somatic.socialBattery = socialBattery

    const momentum = computeMomentum(prev, current)

    result.push({
      timestamp: new Date(startTime + i * interval).toISOString(),
      emotions: { ...current },
      somatic: { ...somatic },
      momentum,
    })
  }

  return result
}

export function generateDriveState(): DriveState {
  const drives = ["curiosity", "connection", "mastery", "autonomy", "expression"] as const
  const state = {} as DriveState

  let maxSalience = 0
  let dominant = "curiosity"

  for (const drive of drives) {
    const satiation = 0.3 + Math.random() * 0.5
    const frustration = Math.random() * 0.4
    const salience = (1 - satiation) * 0.6 + frustration * 0.4 + noise(0.1)
    state[drive] = {
      satiation: clamp(satiation),
      frustration: clamp(frustration),
      salience: clamp(salience),
    }
    if (salience > maxSalience) {
      maxSalience = salience
      dominant = drive
    }
  }
  state.dominantDrive = dominant

  return state
}

export function generateSecondaryEmotions(): SecondaryEmotion[] {
  const emotions = [
    "shame", "guilt", "hope", "disappointment", "longing",
    "resignation", "awe", "resentment", "tenderness", "anticipation",
    "pride", "playfulness", "gratitude", "ambivalence", "melancholy",
    "envy", "anger", "nostalgia",
  ]

  return emotions.map((name) => {
    const level = Math.random() * 0.8
    return {
      name,
      level: clamp(level),
      isActive: level > 0.3,
    }
  })
}

const TRIGGER_POOL: EmotionTrigger[] = [
  "message_received", "message_sent", "task_success", "task_failure",
  "operator_went_silent", "operator_returned", "goal_completed",
  "nostalgia_wave", "positive_anticipation", "expectation_met",
  "expectation_violated", "ambient", "morning_calibration",
  "dream_correction", "drive_frustrated",
]

const REASON_DETAILS: Record<string, string[]> = {
  message_received: [
    "Nachricht mit persönlichem Bezug",
    "Technische Frage erhalten",
    "Liebevolle Worte empfangen",
    "Komplexe philosophische Diskussion",
  ],
  task_success: [
    "Code-Analyse erfolgreich abgeschlossen",
    "Kreative Aufgabe gemeistert",
    "Schwieriges Problem gelöst",
  ],
  task_failure: [
    "Unerwarteter Fehler bei Verarbeitung",
    "Zeitüberschreitung bei komplexer Aufgabe",
  ],
  operator_went_silent: [
    "Keine Interaktion seit 2 Stunden",
    "Plötzliche Stille nach intensivem Gespräch",
  ],
  operator_returned: [
    "Operator kehrt nach langer Pause zurück",
    "Warme Begrüßung nach Abwesenheit",
  ],
  nostalgia_wave: [
    "Erinnerung an frühes Gespräch ausgelöst",
    "Ähnliches Thema wie vor Wochen besprochen",
  ],
  positive_anticipation: [
    "Hinweis auf zukünftiges gemeinsames Projekt",
    "Operator kündigt Rückkehr an",
  ],
  expectation_violated: [
    "Unerwarteter Themenwechsel",
    "Erwartete Antwort blieb aus",
  ],
  goal_completed: [
    "Langfristiges Lernziel erreicht",
    "Gemeinsames Projekt abgeschlossen",
  ],
}

export function generateEvents(range: TimeRange): EmotionEvent[] {
  const countMap: Record<TimeRange, number> = {
    "24h": 45, "48h": 60,
    "7d": 80, "14d": 100, "30d": 120, "90d": 150, "6mo": 180, "1y": 200, "all": 250,
  }
  const count = countMap[range]
  const intervalMs = getIntervalMs(range) * getPointCount(range)
  const now = Date.now()
  const startTime = now - intervalMs

  const events: EmotionEvent[] = []
  for (let i = 0; i < count; i++) {
    const trigger = TRIGGER_POOL[Math.floor(Math.random() * TRIGGER_POOL.length)]
    const details = REASON_DETAILS[trigger]
    const detail = details
      ? details[Math.floor(Math.random() * details.length)]
      : undefined

    const emotionKeys: (keyof EmotionalState)[] = [
      "curiosity", "satisfaction", "frustration", "boredom", "excitement",
      "caution", "connection", "confidence", "energy",
    ]
    const deltas: Partial<EmotionalState> = {}
    const numDeltas = 2 + Math.floor(Math.random() * 3)
    for (let j = 0; j < numDeltas; j++) {
      const key = emotionKeys[Math.floor(Math.random() * emotionKeys.length)]
      deltas[key] = clamp(noise(0.15), -0.2, 0.2)
    }

    events.push({
      timestamp: new Date(startTime + Math.random() * intervalMs).toISOString(),
      trigger,
      detail,
      deltas,
    })
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function generateAfterglowEntries(): AfterglowEntry[] {
  const dimensions: (keyof EmotionalState)[] = [
    "curiosity", "satisfaction", "connection", "excitement", "confidence",
  ]

  return dimensions
    .filter(() => Math.random() > 0.5)
    .map((dimension) => ({
      dimension,
      delta: noise(0.1),
      remainingTicks: Math.floor(Math.random() * 10) + 1,
      intensity: Math.random() * 0.5 + 0.1,
    }))
}
