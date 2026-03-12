"use client"

import { useTranslations } from "next-intl"
import { useMemo, useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

export function EventTimeline({ events, maxItems = 20 }: EventTimelineProps) {
  const t = useTranslations("Events")
  const tt = useTranslations("Triggers")
  const te = useTranslations("Emotions")

  const [visibleCount, setVisibleCount] = useState(0)
  const feedRef = useRef<HTMLDivElement>(null)
  const prevEventsRef = useRef<string>("")

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
      }, 60)
      return () => clearInterval(interval)
    }

    setVisibleCount(displayEvents.length)
  }, [displayEvents])

  const visibleEvents = displayEvents.slice(0, visibleCount)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            <span className="font-mono text-xs text-muted-foreground">
              {displayEvents.length}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={feedRef}
          className="relative max-h-[460px] space-y-px overflow-y-auto"
        >
          <AnimatePresence initial={false}>
            {visibleEvents.map((event, i) => (
              <motion.div
                key={`${event.timestamp}-${i}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <div className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/30">
                  <div
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: TRIGGER_COLORS[event.trigger] ?? "var(--chart-10)" }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium">
                        {tt.has(event.trigger) ? tt(event.trigger) : event.trigger}
                      </span>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground/60">
                        {format(new Date(event.timestamp), "HH:mm")}
                      </span>
                    </div>

                    {event.detail && (
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {event.detail}
                      </p>
                    )}

                    {Object.keys(event.deltas).length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                        {Object.entries(event.deltas).map(([key, value]) => {
                          if (value === undefined) return null
                          const color = EMOTION_COLORS[key as keyof EmotionalState]
                          return (
                            <span
                              key={key}
                              className="inline-flex items-center gap-1 font-mono text-xs tabular-nums"
                            >
                              <span
                                className="inline-block h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-muted-foreground">{te(key as never)}</span>
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
