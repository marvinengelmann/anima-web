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
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { TimeSeriesPoint } from "@/lib/types";

interface ResourceChartProps {
	data: TimeSeriesPoint[];
	bare?: boolean;
}

export function ResourceChart({ data, bare = false }: ResourceChartProps) {
	const t = useTranslations("Resources");

	const chartConfig: ChartConfig = useMemo(
		() => ({
			energy: {
				label: t("energy"),
				color: "var(--chart-4)",
			},
			socialBattery: {
				label: t("socialBattery"),
				color: "var(--chart-14)",
			},
		}),
		[t],
	);

	const chartData = useMemo(
		() =>
			data.map((point) => ({
				time: format(new Date(point.timestamp), "HH:mm"),
				energy: Math.round(point.emotions.energy * 100),
				socialBattery: Math.round(point.somatic.socialBattery * 100),
			})),
		[data],
	);

	const lastPoint = data[data.length - 1];

	const header = (
		<div className="flex items-center justify-between">
			<div>
				<CardTitle>{t("title")}</CardTitle>
				<CardDescription>{t("description")}</CardDescription>
			</div>
			{lastPoint && (
				<div className="flex gap-4 text-sm">
					<div className="flex items-center gap-1.5">
						<div
							className="h-2.5 w-2.5 rounded-full"
							style={{ backgroundColor: "var(--chart-4)" }}
						/>
						<span className="font-mono text-xs tabular-nums">
							{(lastPoint.emotions.energy * 100).toFixed(0)}%
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<div
							className="h-2.5 w-2.5 rounded-full"
							style={{ backgroundColor: "var(--chart-14)" }}
						/>
						<span className="font-mono text-xs tabular-nums">
							{(lastPoint.somatic.socialBattery * 100).toFixed(0)}%
						</span>
					</div>
				</div>
			)}
		</div>
	);

	const chart = (
		<ChartContainer config={chartConfig} className="h-60 w-full">
			<AreaChart data={chartData} accessibilityLayer>
				<CartesianGrid vertical={false} strokeDasharray="3 3" />
				<XAxis
					dataKey="time"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
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
				<ChartTooltip content={<ChartTooltipContent />} />
				<ChartLegend content={<ChartLegendContent />} />
				<Area
					type="monotone"
					dataKey="energy"
					stroke="var(--color-energy)"
					fill="var(--color-energy)"
					fillOpacity={0.15}
					strokeWidth={2}
					dot={false}
				/>
				<Area
					type="monotone"
					dataKey="socialBattery"
					stroke="var(--color-socialBattery)"
					fill="var(--color-socialBattery)"
					fillOpacity={0.15}
					strokeWidth={2}
					dot={false}
				/>
			</AreaChart>
		</ChartContainer>
	);

	if (bare) {
		return (
			<div>
				<div className="px-6 pb-2">{header}</div>
				<div className="px-6 pb-4">{chart}</div>
			</div>
		);
	}

	return (
		<Card className="flex flex-col">
			<CardHeader>{header}</CardHeader>
			<CardContent className="flex-1">{chart}</CardContent>
		</Card>
	);
}
