"use client"

import { useTranslations } from "next-intl"
import { useMemo } from "react"
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from "recharts"
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
import { Badge } from "@/components/ui/badge"
import { DRIVE_KEYS, type DriveState } from "@/lib/types"

interface DriveChartProps {
  data: DriveState
}

export function DriveChart({ data }: DriveChartProps) {
  const t = useTranslations("Drives")

  const dominantLabel = useMemo(() => {
    if (data.dominantDrive) return t(data.dominantDrive as (typeof DRIVE_KEYS)[number])
    const highest = DRIVE_KEYS.reduce((best, key) =>
      data[key].salience > data[best].salience ? key : best
    , DRIVE_KEYS[0])
    return t(highest)
  }, [data, t])

  const chartConfig: ChartConfig = useMemo(
    () => ({
      satiation: { label: t("satiation"), color: "var(--chart-3)" },
      frustration: { label: t("frustration"), color: "var(--chart-6)" },
      salience: { label: t("salience"), color: "var(--chart-2)" },
    }),
    [t]
  )

  const chartData = useMemo(
    () =>
      DRIVE_KEYS.map((key) => ({
        drive: t(key),
        satiation: Math.round(data[key].satiation * 100),
        frustration: Math.round(data[key].frustration * 100),
        salience: Math.round(data[key].salience * 100),
      })),
    [data, t]
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {t("dominant")}: {dominantLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-[4/3] w-full">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="65%">
            <PolarGrid gridType="circle" />
            <PolarAngleAxis
              dataKey="drive"
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              tickLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Radar
              dataKey="satiation"
              stroke="var(--color-satiation)"
              fill="var(--color-satiation)"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Radar
              dataKey="frustration"
              stroke="var(--color-frustration)"
              fill="var(--color-frustration)"
              fillOpacity={0.1}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
            <Radar
              dataKey="salience"
              stroke="var(--color-salience)"
              fill="var(--color-salience)"
              fillOpacity={0.1}
              strokeWidth={1.5}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
