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
import { Badge } from "@/components/ui/badge"
import { ATTACHMENT_KEYS, type AttachmentData } from "@/lib/types"

interface AttachmentChartProps {
  data: AttachmentData
}

export function AttachmentChart({ data }: AttachmentChartProps) {
  const t = useTranslations("Attachment")

  const chartConfig: ChartConfig = useMemo(
    () => ({
      value: { label: t("title"), color: "var(--chart-3)" },
    }),
    [t]
  )

  const chartData = useMemo(
    () =>
      ATTACHMENT_KEYS.map((key) => ({
        dimension: t(key),
        value: Math.round(data.style[key] * 100),
      })),
    [data.style, t]
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          {data.phase && (
            <Badge variant="secondary" className="text-xs">
              {t("phase")}: {data.phase}
            </Badge>
          )}
        </div>
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
