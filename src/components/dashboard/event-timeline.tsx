"use client"

import { useTranslations } from "next-intl"
import { useMemo, useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { EmotionEvent, EmotionalState } from "@/lib/types"
import { EMOTION_COLORS } from "@/lib/colors"
import { format } from "date-fns"

interface EventTimelineProps {
  events: EmotionEvent[]
  maxItems?: number
}

const TRIGGER_COLORS: Record<string, string> = {
  message_received: "var(--chart-1)",
  message_sent: "var(--chart-2)",
  task_success: "var(--chart-3)",
  task_failure: "var(--chart-6)",
  guardian_warning: "var(--chart-5)",
  guardian_block: "var(--chart-6)",
  operator_went_silent: "var(--chart-10)",
  operator_returned: "var(--chart-1)",
  system_degraded: "var(--chart-6)",
  system_recovered: "var(--chart-3)",
  new_goal: "var(--chart-4)",
  goal_completed: "var(--chart-3)",
  goal_failed: "var(--chart-6)",
  weather_update: "var(--chart-5)",
  git_activity: "var(--chart-9)",
  dream_correction: "var(--chart-8)",
  morning_calibration: "var(--chart-4)",
  nostalgia_wave: "var(--chart-12)",
  relational_pattern_match: "var(--chart-8)",
  drive_frustrated: "var(--chart-7)",
  drive_conflict: "var(--chart-7)",
  positive_anticipation: "var(--chart-11)",
  expectation_violated: "var(--chart-6)",
  expectation_met: "var(--chart-3)",
  boundary_violated: "var(--chart-6)",
  memory_contradiction: "var(--chart-9)",
}

export function EventTimeline({ events, maxItems = 8 }: EventTimelineProps) {
  const t = useTranslations("Events")
  const tt = useTranslations("Triggers")
  const te = useTranslations("Emotions")

  const [visibleCount, setVisibleCount] = useState(0)
  const prevEventsRef = useMemo(() => ({ current: "" }), [])

  const displayEvents = useMemo(
    () => events.slice(0, maxItems),
    [events, maxItems],
  )

  useEffect(() => {
    const eventsKey = displayEvents.map((e) => e.timestamp).join(",")

    if (prevEventsRef.current === eventsKey) return
    const wasEmpty = prevEventsRef.current === ""
    prevEventsRef.current = eventsKey

    if (wasEmpty) {
      let count = 0
      const interval = setInterval(() => {
        count++
        setVisibleCount(count)
        if (count >= displayEvents.length) clearInterval(interval)
      }, 120)
      return () => clearInterval(interval)
    }

    setVisibleCount(displayEvents.length)
  }, [displayEvents, prevEventsRef])

  const visibleEvents = displayEvents.slice(0, visibleCount)

  return (
    <section className="border-t border-border/50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2>
            {t("title")}
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-2xl">
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {visibleEvents.map((event, i) => (
                <motion.div
                  key={`${event.timestamp}-${i}`}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="rounded-2xl border border-border/50 bg-background/80 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_24px] hover:shadow-primary/5">
                    <div className="flex items-start gap-4">
                      <div
                        className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: TRIGGER_COLORS[event.trigger] ?? "var(--chart-10)" }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-base font-medium">
                            {tt.has(event.trigger) ? tt(event.trigger) : event.trigger}
                          </span>
                          <span className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground/50">
                            {format(new Date(event.timestamp), "HH:mm")}
                          </span>
                        </div>

                        {event.detail && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {event.detail}
                          </p>
                        )}

                        {Object.keys(event.deltas).length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {Object.entries(event.deltas).map(([key, value]) => {
                              if (value === undefined) return null
                              const color = EMOTION_COLORS[key as keyof EmotionalState]
                              return (
                                <span
                                  key={key}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-border/50 px-2.5 py-1 font-mono text-xs tabular-nums"
                                >
                                  <span
                                    className="inline-block h-1.5 w-1.5 rounded-full"
                                    style={{ backgroundColor: color }}
                                  />
                                  {te(key as never)}
                                  <span className={value > 0 ? "text-green-500" : "text-red-500"}>
                                    {value > 0 ? "+" : ""}{(value * 100).toFixed(0)}
                                  </span>
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>
    </section>
  )
}
