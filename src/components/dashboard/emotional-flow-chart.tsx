"use client"

import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EMOTION_KEYS, type TimeSeriesPoint } from "@/lib/types"
import { EMOTION_COLORS } from "@/lib/colors"
import { format } from "date-fns"

interface EmotionalFlowChartProps {
  data: TimeSeriesPoint[]
}

export function EmotionalFlowChart({ data }: EmotionalFlowChartProps) {
  const t = useTranslations("Emotions")

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {}
    for (const key of EMOTION_KEYS) {
      config[key] = {
        label: t(key),
        color: EMOTION_COLORS[key],
      }
    }
    return config
  }, [t])

  const chartData = useMemo(
    () =>
      data.map((point) => ({
        time: format(new Date(point.timestamp), "HH:mm"),
        ...point.emotions,
      })),
    [data]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <AreaChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
              interval="preserveStartEnd"
              minTickGap={40}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, 1]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.toFixed(1)}
              width={35}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => label}
                  indicator="line"
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {EMOTION_KEYS.map((key) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`var(--color-${key})`}
                fill="transparent"
                strokeWidth={1.5}
                dot={false}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
