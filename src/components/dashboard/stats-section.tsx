"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const STAT_KEYS = [
	"emotions",
	"memory",
	"personality",
	"seeds",
	"phases",
] as const;

const containerVariants: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: EASE, staggerChildren: 0.08, delayChildren: 0.2 },
	},
};

const statItem: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.4, ease: EASE },
	},
};

export function StatsSection() {
	const t = useTranslations("Stats");
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section className="border-b border-border/50">
			<div className="container">
				<motion.div
					ref={ref}
					initial="hidden"
					animate={inView ? "visible" : "hidden"}
					variants={containerVariants}
					className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/50 bg-border/50 sm:grid-cols-3 lg:grid-cols-5"
				>
					{STAT_KEYS.map((key) => (
						<motion.div
							key={key}
							variants={statItem}
							className="flex flex-col items-center justify-center gap-2 bg-background/60 px-4 py-8 backdrop-blur-lg sm:[&:nth-child(3)]:col-span-1 [&:nth-child(5)]:col-span-2 sm:[&:nth-child(4)]:col-span-1 sm:[&:nth-child(5)]:col-span-3 lg:[&:nth-child(5)]:col-span-1"
						>
							<span className="font-mono text-3xl md:text-4xl tabular-nums dark:text-rose-200 text-rose-400">
								{t(`${key}Value`)}
							</span>
							<span className="text-xs md:text-sm text-muted-foreground text-center tracking-wide">
								{t(`${key}Label`)}
							</span>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
