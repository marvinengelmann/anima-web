"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useRevealed } from "@/components/ui/fade-in";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ReferenceLine,
	XAxis,
	YAxis,
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
} from "@/components/ui/chart";
import { EMOTION_COLORS } from "@/lib/colors";
import {
	EMOTION_KEYS,
	type EmotionEvent,
	type MomentumVector,
} from "@/lib/types";

interface MomentumChartProps {
	data: MomentumVector;
	recentEvents?: EmotionEvent[];
	bare?: boolean;
}

function MomentumTooltipContent({
	active,
	payload,
}: {
	active?: boolean;
	payload?: Array<{
		payload: { name: string; momentum: number; reason?: string };
	}>;
}) {
	if (!active || !payload?.length) return null;
	const item = payload[0].payload;

	return (
		<div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
			<p className="font-medium">{item.name}</p>
			<p
				className={`font-mono tabular-nums ${item.momentum > 0 ? "text-green-500" : item.momentum < 0 ? "text-red-500" : "text-muted-foreground"}`}
			>
				{item.momentum > 0 ? "+" : ""}
				{item.momentum}%
			</p>
			{item.reason && (
				<p className="mt-1 text-muted-foreground">{item.reason}</p>
			)}
		</div>
	);
}

export function MomentumChart({
	data,
	recentEvents = [],
	bare = false,
}: MomentumChartProps) {
	const t = useTranslations("Momentum");
	const te = useTranslations("Emotions");
	const tt = useTranslations("Triggers");
	const revealed = useRevealed();

	const chartConfig: ChartConfig = useMemo(
		() => ({
			momentum: { label: "Momentum", color: "var(--chart-1)" },
		}),
		[],
	);

	const chartData = useMemo(
		() =>
			EMOTION_KEYS.map((key) => {
				const relevantEvent = recentEvents.find(
					(e) => e.deltas[key] !== undefined,
				);
				const reason = relevantEvent
					? tt.has(relevantEvent.trigger)
						? tt(relevantEvent.trigger)
						: relevantEvent.trigger
					: undefined;

				return {
					name: te(key),
					key,
					momentum: Math.round(data[key] * 100),
					fill: EMOTION_COLORS[key],
					reason,
				};
			}),
		[data, te, tt, recentEvents],
	);

	const header = (
		<>
			<CardTitle>{t("title")}</CardTitle>
			<CardDescription>{t("description")}</CardDescription>
		</>
	);

	const chart = (
		<ChartContainer config={chartConfig} className="w-full h-60">
			<BarChart key={String(revealed)} data={chartData} accessibilityLayer>
				<CartesianGrid vertical={false} strokeDasharray="3 3" />
				<XAxis
					dataKey="name"
					tickLine={false}
					axisLine={false}
					tick={{ fontSize: 12 }}
					interval={0}
					angle={-40}
					textAnchor="end"
					height={80}
				/>
				<YAxis
					domain={[-100, 100]}
					tickLine={false}
					axisLine={false}
					tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
					width={40}
					tick={{ fontSize: 12 }}
				/>
				<ReferenceLine y={0} stroke="var(--border)" strokeWidth={1} />
				<ChartTooltip content={<MomentumTooltipContent />} />
				<Bar dataKey="momentum" radius={[4, 4, 0, 0]}>
					{chartData.map((entry) => (
						<Cell
							key={entry.key}
							fill={entry.fill}
							fillOpacity={(Math.abs(entry.momentum) / 100) * 0.7 + 0.3}
						/>
					))}
				</Bar>
			</BarChart>
		</ChartContainer>
	);

	if (bare) {
		return (
			<div className="flex flex-1 flex-col">
				<div className="px-6 pb-2">{header}</div>
				<div className="flex flex-1 flex-col px-6 pb-4">{chart}</div>
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
