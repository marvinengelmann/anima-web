import { pgTable, uuid, jsonb, text, timestamp, index } from "drizzle-orm/pg-core"

export const emotionHistory = pgTable(
  "emotion_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    state: jsonb("state").notNull(),
    trigger: text("trigger"),
    tickId: text("tick_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_emotion_history_trigger").on(table.trigger),
    index("idx_emotion_history_tick_id").on(table.tickId),
    index("idx_emotion_history_created").on(table.createdAt),
  ]
)

export type EmotionHistorySelect = typeof emotionHistory.$inferSelect

export const somaticHistory = pgTable(
  "somatic_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    state: jsonb("state").notNull(),
    trigger: text("trigger").notNull(),
    tickId: text("tick_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("idx_somatic_history_created").on(table.createdAt)]
)

export type SomaticHistorySelect = typeof somaticHistory.$inferSelect
