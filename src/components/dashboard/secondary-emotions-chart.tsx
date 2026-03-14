"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useRevealed } from "@/components/ui/fade-in";
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
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { SECONDARY_COLORS } from "@/lib/colors";
import type { SecondaryEmotion } from "@/lib/types";

interface SecondaryEmotionsChartProps {
	data: SecondaryEmotion[];
}

export function SecondaryEmotionsChart({ data }: SecondaryEmotionsChartProps) {
	const t = useTranslations("Secondary");
	const revealed = useRevealed();

	const chartConfig: ChartConfig = useMemo(() => {
		const config: ChartConfig = {};
		for (const emotion of data) {
			config[emotion.name] = {
				label: t(emotion.name as never),
				color: SECONDARY_COLORS[emotion.name] ?? "var(--chart-18)",
			};
		}
		config.level = { label: t("intensity") };
		return config;
	}, [data, t]);

	const sorted = useMemo(
		() => [...data].sort((a, b) => b.level - a.level),
		[data],
	);

	const chartData = useMemo(
		() =>
			sorted.map((e) => ({
				name: t(e.name as never),
				key: e.name,
				level: Math.round(e.level * 100),
				isActive: e.isActive,
				fill: SECONDARY_COLORS[e.name] ?? "var(--chart-18)",
			})),
		[sorted, t],
	);

	const activeCount = data.filter((e) => e.isActive).length;

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
				<ChartContainer config={chartConfig} className="h-60 w-full">
					<BarChart key={String(revealed)} data={chartData} accessibilityLayer>
						<XAxis
							dataKey="name"
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 11 }}
							interval={0}
							angle={-45}
							textAnchor="end"
							height={80}
						/>
						<YAxis
							type="number"
							domain={[0, 100]}
							tickLine={false}
							axisLine={false}
							tickFormatter={(v) => `${v}%`}
							width={40}
							tick={{ fontSize: 12 }}
						/>
						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
						<Bar dataKey="level" radius={[4, 4, 0, 0]} barSize={20}>
							{chartData.map((entry) => (
								<Cell
									key={entry.key}
									fill={entry.fill}
									fillOpacity={entry.isActive ? 1 : 0.35}
								/>
							))}
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
