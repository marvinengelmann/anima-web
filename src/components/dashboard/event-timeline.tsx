"use client";

import { format } from "date-fns";
import { motion, useInView, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo, useRef } from "react";
import type { TimelineEvent, TimelineEventType } from "@/lib/types";

interface EventTimelineProps {
	events: TimelineEvent[];
	maxItems?: number;
}

const EVENT_COLORS: Record<TimelineEventType, string> = {
	lifecycle_started: "var(--chart-4)",
	lifecycle_ended: "var(--chart-10)",
	sleep_started: "var(--chart-15)",
	woke_up: "var(--chart-14)",
	dream_started: "var(--chart-15)",
	dream_ended: "var(--chart-9)",
	conversation_started: "var(--chart-1)",
	conversation_ended: "var(--chart-18)",
	goal_created: "var(--chart-14)",
	goal_completed: "var(--chart-16)",
	goal_failed: "var(--chart-6)",
	creative_output: "var(--chart-9)",
	evolution_applied: "var(--chart-17)",
	posted_to_x: "var(--chart-7)",
	reflection_completed: "var(--chart-12)",
	guardian_blocked: "var(--chart-6)",
	guardian_warned: "var(--chart-5)",
	altered_state_started: "var(--chart-13)",
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

function getEventSubtype(event: TimelineEvent): string | null {
	const meta = event.metadata;
	if (!meta) return null;

	if (
		(event.type === "lifecycle_started" || event.type === "lifecycle_ended") &&
		typeof meta.eventType === "string"
	) {
		return meta.eventType;
	}

	if (
		event.type === "altered_state_started" &&
		typeof meta.alteredEventType === "string"
	) {
		return meta.alteredEventType;
	}

	return null;
}

export function EventTimeline({ events, maxItems = 8 }: EventTimelineProps) {
	const t = useTranslations("Events");
	const te = useTranslations("TimelineEvents");
	const tl = useTranslations("LifecycleTypes");
	const ta = useTranslations("AlteredTypes");
	const headerRef = useRef(null);
	const listRef = useRef(null);
	const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
	const listInView = useInView(listRef, { once: true, margin: "-80px" });

	const displayEvents = useMemo(
		() => events.slice(0, maxItems),
		[events, maxItems],
	);

	function renderLabel(event: TimelineEvent) {
		const mainLabel = te.has(event.type) ? te(event.type) : event.type;
		const subtype = getEventSubtype(event);

		if (!subtype) return mainLabel;

		if (event.type === "altered_state_started") {
			const subtypeLabel = ta.has(subtype) ? ta(subtype) : subtype;
			return `${mainLabel}: ${subtypeLabel}`;
		}

		const subtypeLabel = tl.has(subtype) ? tl(subtype) : subtype;
		return `${mainLabel}: ${subtypeLabel}`;
	}

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
													EVENT_COLORS[event.type] ?? "var(--chart-10)",
											}}
										/>

										<div className="flex-1 min-w-0">
											<div className="flex items-baseline justify-between gap-3">
												<span className="text-base font-medium">
													{renderLabel(event)}
												</span>
												<span className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground/50">
													{format(new Date(event.timestamp), "HH:mm")}
												</span>
											</div>
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
