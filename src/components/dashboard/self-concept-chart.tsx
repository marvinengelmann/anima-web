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
import { SELF_CONCEPT_KEYS, type SelfConceptState } from "@/lib/types"

interface SelfConceptChartProps {
  data: SelfConceptState
}

export function SelfConceptChart({ data }: SelfConceptChartProps) {
  const t = useTranslations("SelfConcept")

  const chartConfig: ChartConfig = useMemo(
    () => ({
      value: { label: t("title"), color: "var(--chart-1)" },
    }),
    [t]
  )

  const chartData = useMemo(
    () =>
      SELF_CONCEPT_KEYS.map((key) => ({
        dimension: t(key),
        value: Math.round(data[key] * 100),
      })),
    [data, t]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="65%">
            <PolarGrid gridType="circle" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              tickLine={false}
            />
            <PolarRadiusAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Radar
              dataKey="value"
              stroke="var(--color-value)"
              fill="var(--color-value)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
