"use client"

import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SOMATIC_KEYS, type SomaticState } from "@/lib/types"

interface SomaticRadarChartProps {
  current: SomaticState
  average: SomaticState
}

export function SomaticRadarChart({ current, average }: SomaticRadarChartProps) {
  const t = useTranslations("Somatic")

  const chartConfig: ChartConfig = useMemo(
    () => ({
      current: { label: "Current", color: "var(--chart-1)" },
      average: { label: "Average", color: "var(--chart-10)" },
    }),
    []
  )

  const chartData = useMemo(
    () =>
      SOMATIC_KEYS.map((key) => ({
        dimension: t(key),
        current: Math.round(current[key] * 100),
        average: Math.round(average[key] * 100),
      })),
    [current, average, t]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-[4/3] w-full">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="65%">
            <PolarGrid gridType="circle" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              tickLine={false}
            />
            <PolarRadiusAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
            />
            <Radar
              dataKey="average"
              stroke="var(--color-average)"
              fill="var(--color-average)"
              fillOpacity={0.1}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <Radar
              dataKey="current"
              stroke="var(--color-current)"
              fill="var(--color-current)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
