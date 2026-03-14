"use client";

import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useRevealed } from "@/components/ui/fade-in";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { EMOTION_COLORS } from "@/lib/colors";
import { EMOTION_KEYS, type TimeSeriesPoint } from "@/lib/types";

interface EmotionalFlowChartProps {
	data: TimeSeriesPoint[];
}

export function EmotionalFlowChart({ data }: EmotionalFlowChartProps) {
	const t = useTranslations("Emotions");

	const chartConfig = useMemo(() => {
		const config: ChartConfig = {};
		for (const key of EMOTION_KEYS) {
			config[key] = {
				label: t(key),
				color: EMOTION_COLORS[key],
			};
		}
		return config;
	}, [t]);

	const chartData = useMemo(
		() =>
			data.map((point) => {
				const entry: Record<string, string | number> = {
					time: format(new Date(point.timestamp), "HH:mm"),
				};
				for (const key of EMOTION_KEYS) {
					entry[key] = Math.round(point.emotions[key] * 100);
				}
				return entry;
			}),
		[data],
	);

	const revealed = useRevealed();

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("title")}</CardTitle>
				<CardDescription>{t("description")}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-60 w-full">
					<AreaChart key={String(revealed)} data={chartData} accessibilityLayer>
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
							domain={[0, 100]}
							tickLine={false}
							axisLine={false}
							tickFormatter={(v) => `${v}%`}
							width={40}
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
	);
}
