"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useMemo } from "react"
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { BigFive } from "@/lib/seed/types"

const EASE = [0.25, 0.46, 0.45, 0.94] as const
const BIG_FIVE_KEYS: (keyof BigFive)[] = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"]

interface BigFiveSectionProps {
  bigFive: BigFive
  delay: number
}

export function BigFiveSection({ bigFive, delay }: BigFiveSectionProps) {
  const t = useTranslations("Seed")

  const chartConfig: ChartConfig = useMemo(() => ({
    value: { label: t("bigFive"), color: "var(--chart-1)" },
  }), [t])

  const chartData = useMemo(() =>
    BIG_FIVE_KEYS.map((key) => ({
      dimension: t(key),
      value: Math.round(bigFive[key] * 100),
    })),
  [bigFive, t])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay }}

      className="h-full"
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{t("bigFive")}</CardTitle>
          <CardDescription>{t("bigFiveDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <RadarChart data={chartData}>
              <PolarGrid gridType="circle" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                tickLine={false}
              />
              <PolarRadiusAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Radar dataKey="value" stroke="var(--color-value)" fill="var(--color-value)" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
