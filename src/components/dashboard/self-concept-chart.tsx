"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useRevealed } from "@/components/ui/fade-in";
import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
} from "recharts";
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
import { SELF_CONCEPT_KEYS, type SelfConceptState } from "@/lib/types";

interface SelfConceptChartProps {
	data: SelfConceptState;
}

export function SelfConceptChart({ data }: SelfConceptChartProps) {
	const t = useTranslations("SelfConcept");
	const revealed = useRevealed();

	const chartConfig: ChartConfig = useMemo(
		() => ({
			value: { label: t("title"), color: "var(--chart-1)" },
		}),
		[t],
	);

	const chartData = useMemo(
		() =>
			SELF_CONCEPT_KEYS.map((key) => ({
				dimension: t(key),
				value: Math.round(data[key] * 100),
			})),
		[data, t],
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("title")}</CardTitle>
				<CardDescription>{t("description")}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-90 w-full">
					<RadarChart key={String(revealed)} data={chartData}>
						<PolarGrid gridType="circle" />
						<PolarAngleAxis
							dataKey="dimension"
							tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
							tickLine={false}
						/>
						<PolarRadiusAxis
							type="number"
							domain={[0, 100]}
							tick={false}
							axisLine={false}
						/>
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
	);
}
