"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useRevealed } from "@/components/ui/fade-in";
import { EMOTION_COLORS } from "@/lib/colors";
import type { AfterglowEntry, EmotionalState } from "@/lib/types";

interface AfterglowCardsProps {
	entries: AfterglowEntry[];
}

interface GroupedAfterglow {
	dimension: keyof EmotionalState;
	count: number;
	totalDelta: number;
	maxIntensity: number;
	maxTicks: number;
}

export function AfterglowCards({ entries }: AfterglowCardsProps) {
	const t = useTranslations("Afterglow");
	const te = useTranslations("Emotions");
	const revealed = useRevealed();

	const groups = useMemo(() => {
		const map = new Map<keyof EmotionalState, AfterglowEntry[]>();
		for (const entry of entries) {
			const list = map.get(entry.dimension) ?? [];
			list.push(entry);
			map.set(entry.dimension, list);
		}
		return Array.from(map.entries())
			.map(
				([dimension, items]): GroupedAfterglow => ({
					dimension,
					count: items.length,
					totalDelta: items.reduce((sum, e) => sum + e.delta, 0),
					maxIntensity: Math.max(...items.map((e) => e.intensity)),
					maxTicks: Math.max(...items.map((e) => e.remainingTicks)),
				}),
			)
			.sort((a, b) => Math.abs(b.totalDelta) - Math.abs(a.totalDelta));
	}, [entries]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("title")}</CardTitle>
				<CardDescription>{t("description")}</CardDescription>
			</CardHeader>
			{entries.length === 0 ? (
				<CardContent>
					<p className="text-sm text-muted-foreground">{t("empty")}</p>
				</CardContent>
			) : <CardContent>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{groups.map((group) => {
						const color = EMOTION_COLORS[group.dimension];
						const isPositive = group.totalDelta > 0;
						const layers = Math.min(group.count - 1, 3);
						return (
							<div key={group.dimension}>
								<div className="relative" style={{ zIndex: 10 }}>
									<div
										className="relative overflow-hidden rounded-lg border bg-background/90 p-3 backdrop-blur-sm"
										style={{
											borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
										}}
									>
										<div
											className="absolute inset-0 opacity-6"
											style={{ backgroundColor: color }}
										/>
										<div className="relative">
											<div className="flex items-center justify-between mb-2">
												<div className="flex items-center gap-2">
													<div
														className="h-2.5 w-2.5 rounded-full"
														style={{ backgroundColor: color }}
													/>
													<span className="text-sm font-medium">
														{te(group.dimension)}
													</span>
													{group.count > 1 && (
														<span className="rounded-full px-1.5 py-0.5 text-[10px] font-mono tabular-nums" style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, color: `color-mix(in srgb, ${color} 60%, transparent)` }}>
															×{group.count}
														</span>
													)}
												</div>
												<span
													className={`text-xs font-mono font-medium tabular-nums ${isPositive ? "text-green-500" : "text-red-500"}`}
												>
													{isPositive ? "+" : ""}
													{(group.totalDelta * 100).toFixed(0)}
												</span>
											</div>
											<div className="flex items-center justify-between text-xs text-muted-foreground">
												<span>
													{t("ticksRemaining", { count: group.maxTicks })}
												</span>
												<span>
													{t("intensity")}:{" "}
													{(group.maxIntensity * 100).toFixed(0)}%
												</span>
											</div>
											<div className="mt-2 h-1 w-full rounded-full" style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}>
												<div
													className="h-full rounded-full transition-all duration-700"
													style={{
														width: revealed ? `${group.maxIntensity * 100}%` : "0%",
														backgroundColor: color,
													}}
												/>
											</div>
										</div>
									</div>
								</div>
								{Array.from({ length: layers }, (_, i) => (
									<div
										key={i}
										className="relative rounded-lg border bg-background/90 backdrop-blur-sm"
										style={{
											height: 8,
											marginTop: -4,
											marginLeft: (i + 1) * 6,
											marginRight: (i + 1) * 6,
											zIndex: 10 - (i + 1),
											opacity: 1 - (i + 1) * 0.3,
											borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
										}}
									>
										<div
											className="absolute inset-0 rounded-lg opacity-[0.03]"
											style={{ backgroundColor: color }}
										/>
									</div>
								))}
							</div>
						);
					})}
				</div>
			</CardContent>}
		</Card>
	);
}
