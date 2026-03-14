"use client";

import { format } from "date-fns";
import { motion, useInView, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo, useRef } from "react";
import { EMOTION_COLORS } from "@/lib/colors";
import type { EmotionalState, EmotionEvent } from "@/lib/types";

interface EventTimelineProps {
	events: EmotionEvent[];
	maxItems?: number;
}

const TRIGGER_COLORS: Record<string, string> = {
	message_received: "var(--chart-1)",
	message_sent: "var(--chart-10)",
	task_success: "var(--chart-16)",
	task_failure: "var(--chart-6)",
	guardian_warning: "var(--chart-5)",
	guardian_block: "var(--chart-6)",
	operator_went_silent: "var(--chart-18)",
	operator_returned: "var(--chart-16)",
	system_degraded: "var(--chart-6)",
	system_recovered: "var(--chart-3)",
	new_goal: "var(--chart-14)",
	goal_completed: "var(--chart-16)",
	goal_failed: "var(--chart-6)",
	weather_update: "var(--chart-10)",
	git_activity: "var(--chart-17)",
	dream_correction: "var(--chart-15)",
	morning_calibration: "var(--chart-14)",
	nostalgia_wave: "var(--chart-9)",
	relational_pattern_match: "var(--chart-7)",
	drive_frustrated: "var(--chart-13)",
	drive_conflict: "var(--chart-12)",
	positive_anticipation: "var(--chart-4)",
	expectation_violated: "var(--chart-6)",
	expectation_met: "var(--chart-3)",
	boundary_violated: "var(--chart-6)",
	memory_contradiction: "var(--chart-17)",
};

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const headerVariants: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const staggerContainer: Variants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.08 } },
};

const eventItem: Variants = {
	hidden: { opacity: 0, y: 20, scale: 0.97 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.4, ease: EASE },
	},
};

export function EventTimeline({ events, maxItems = 8 }: EventTimelineProps) {
	const t = useTranslations("Events");
	const tt = useTranslations("Triggers");
	const te = useTranslations("Emotions");
	const headerRef = useRef(null);
	const listRef = useRef(null);
	const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
	const listInView = useInView(listRef, { once: true, margin: "-80px" });

	const displayEvents = useMemo(
		() => events.slice(0, maxItems),
		[events, maxItems],
	);

	return (
		<section className="border-t border-border/50 bg-muted">
			<div className="container">
				<motion.div
					ref={headerRef}
					initial="hidden"
					animate={headerInView ? "visible" : "hidden"}
					variants={headerVariants}
					className="mx-auto max-w-2xl text-center flex flex-col gap-6"
				>
					<h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground">
						{t("title")}
					</h2>
					<p className="text-base lg:text-lg font-light text-muted-foreground">
						{t("description")}
					</p>
				</motion.div>

				<div className="relative mx-auto mt-14 max-w-2xl">
					<motion.div
						ref={listRef}
						initial="hidden"
						animate={listInView ? "visible" : "hidden"}
						variants={staggerContainer}
						className="flex flex-col gap-3"
					>
						{displayEvents.map((event, i) => (
							<motion.div key={`${event.timestamp}-${i}`} variants={eventItem}>
								<div className="rounded-2xl border border-border/50 bg-card p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_24px] hover:shadow-primary/5">
									<div className="flex items-start gap-4">
										<div
											className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
											style={{
												backgroundColor:
													TRIGGER_COLORS[event.trigger] ?? "var(--chart-10)",
											}}
										/>

										<div className="flex-1 min-w-0">
											<div className="flex items-baseline justify-between gap-3">
												<span className="text-base font-medium">
													{tt.has(event.trigger)
														? tt(event.trigger)
														: event.trigger}
												</span>
												<span className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground/50">
													{format(new Date(event.timestamp), "HH:mm")}
												</span>
											</div>

											{event.detail && (
												<p className="mt-1 text-sm text-muted-foreground">
													{event.detail}
												</p>
											)}

											{Object.keys(event.deltas).length > 0 && (
												<div className="mt-3 flex flex-wrap gap-2">
													{Object.entries(event.deltas).map(([key, value]) => {
														if (value === undefined) return null;
														const color =
															EMOTION_COLORS[key as keyof EmotionalState];
														return (
															<span
																key={key}
																className="inline-flex items-center gap-1.5 rounded-full border border-border/50 px-2.5 py-1 font-mono text-xs tabular-nums"
															>
																<span
																	className="inline-block h-1.5 w-1.5 rounded-full"
																	style={{ backgroundColor: color }}
																/>
																{te(key as never)}
																<span
																	className={
																		value > 0
																			? "text-green-500"
																			: "text-red-500"
																	}
																>
																	{value > 0 ? "+" : ""}
																	{(value * 100).toFixed(0)}
																</span>
															</span>
														);
													})}
												</div>
											)}
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>

					<div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-muted to-transparent" />
				</div>
			</div>
		</section>
	);
}
