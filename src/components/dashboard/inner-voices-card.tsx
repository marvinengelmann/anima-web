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
import { useRevealed } from "@/components/ui/fade-in";
import type { PolyphonyState } from "@/lib/types";

interface InnerVoicesCardProps {
	data: PolyphonyState;
}

export function InnerVoicesCard({ data }: InnerVoicesCardProps) {
	const t = useTranslations("InnerVoices");
	const revealed = useRevealed();

	const hasVoices = data.activeVoices.length > 0;
	const tensionPercent = Math.round(data.tensionLevel * 100);

	return (
		<Card className="flex-1">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>{t("title")}</CardTitle>
						<CardDescription>{t("description")}</CardDescription>
					</div>
					{hasVoices && data.dominantVoice && (
						<Badge variant="secondary" className="text-xs">
							{t("dominant")}: {t.has(`voiceNames.${data.dominantVoice}`) ? t(`voiceNames.${data.dominantVoice}`) : data.dominantVoice}
						</Badge>
					)}
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{!hasVoices ? (
					<p className="text-sm text-muted-foreground">{t("noDialog")}</p>
				) : (
					<>
						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">{t("tension")}</span>
								<span className="font-medium">{tensionPercent}%</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
								<div
									className="h-full rounded-full transition-all duration-700"
									style={{
										width: revealed ? `${tensionPercent}%` : "0%",
										backgroundColor:
											tensionPercent > 70
												? "var(--chart-6)"
												: tensionPercent > 40
													? "var(--chart-5)"
													: "var(--chart-3)",
									}}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<span className="text-sm text-muted-foreground">
								{t("voices")}
							</span>
							<div className="flex flex-wrap gap-1.5">
								{data.activeVoices.map((voice) => (
									<Badge
										key={voice}
										variant={
											voice === data.dominantVoice ? "default" : "outline"
										}
										className="text-xs"
									>
										{t.has(`voiceNames.${voice}`) ? t(`voiceNames.${voice}`) : voice}
									</Badge>
								))}
							</div>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
