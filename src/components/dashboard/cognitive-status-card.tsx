"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ValueBar } from "@/components/ui/value-bar";
import type { CognitiveStatusData } from "@/lib/types";

interface CognitiveStatusCardProps {
	data: CognitiveStatusData;
}

export function CognitiveStatusCard({ data }: CognitiveStatusCardProps) {
	const t = useTranslations("Cognitive");
	const bars = [
		{
			label: t("clarity"),
			value: data.cognitiveClarity,
			color: "var(--chart-10)",
		},
		{
			label: t("fatigue"),
			value: data.cognitiveFatigue,
			color: "var(--chart-5)",
		},
		{
			label: t("calibration"),
			value: data.confidenceCalibration,
			color: "var(--chart-1)",
		},
	];

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>{t("title")}</CardTitle>
						<CardDescription>{t("description")}</CardDescription>
					</div>
					{data.attentionFocus && (
						<Badge variant="secondary" className="text-xs">
							{t("attention")}: {data.attentionFocus}
						</Badge>
					)}
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				{bars.map((bar) => (
					<div key={bar.label} className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">{bar.label}</span>
							<span className="font-medium">
								{Math.round(bar.value * 100)}%
							</span>
						</div>
						<div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
							<ValueBar percent={Math.round(bar.value * 100)} color={bar.color} />
						</div>
					</div>
				))}

				{data.ruminationDetected && (
					<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 mt-3">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-destructive">
								{t("rumination")}
							</span>
							<Badge variant="destructive" className="text-xs">
								{t("ruminationTicks", { count: data.ruminationTicks })}
							</Badge>
						</div>
						{data.ruminationTopic && (
							<p className="mt-1 text-xs text-muted-foreground">
								{data.ruminationTopic}
							</p>
						)}
					</div>
				)}

				{data.complexDecisionCount > 0 && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">{t("decisions")}</span>
						<Badge variant="outline" className="text-xs">
							{data.complexDecisionCount}
						</Badge>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
