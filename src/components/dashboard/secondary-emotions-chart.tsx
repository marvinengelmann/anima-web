"use client"

import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
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
import { Badge } from "@/components/ui/badge"
import type { SecondaryEmotion } from "@/lib/types"
import { SECONDARY_COLORS } from "@/lib/colors"

interface SecondaryEmotionsChartProps {
  data: SecondaryEmotion[]
}

export function SecondaryEmotionsChart({ data }: SecondaryEmotionsChartProps) {
  const t = useTranslations("Secondary")

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {}
    for (const emotion of data) {
      config[emotion.name] = {
        label: t(emotion.name as never),
        color: SECONDARY_COLORS[emotion.name] ?? "var(--chart-18)",
      }
    }
    return config
  }, [data, t])

  const sorted = useMemo(
    () => [...data].sort((a, b) => b.level - a.level),
    [data]
  )

  const chartData = useMemo(
    () =>
      sorted.map((e) => ({
        name: e.name,
        label: t(e.name as never),
        level: Math.round(e.level * 100),
        isActive: e.isActive,
        fill: SECONDARY_COLORS[e.name] ?? "var(--chart-18)",
      })),
    [sorted, t]
  )

  const activeCount = data.filter((e) => e.isActive).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="default" className="text-xs">
              {activeCount} {t("active")}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {data.length - activeCount} {t("latent")}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-full"
          style={{ height: `${chartData.length * 32 + 40}px` }}
        >
          <BarChart data={chartData} layout="vertical" accessibilityLayer margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              axisLine={false}
              width={110}
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="level" radius={[0, 4, 4, 0]} barSize={18}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.fill}
                  fillOpacity={entry.isActive ? 1 : 0.35}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
