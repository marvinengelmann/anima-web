"use client";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
	faBrain,
	faCommentDots,
	faDatabase,
	faFingerprint,
	faHeart,
	faSparkles,
	faUsers,
	faWavePulse,
} from "@fortawesome/pro-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion, useInView, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

const FEATURE_KEYS = [
	"consciousness",
	"affect",
	"cognition",
	"memory",
	"relationship",
	"identity",
	"communication",
	"evolution",
] as const;

const FEATURE_ICONS: Record<(typeof FEATURE_KEYS)[number], IconDefinition> = {
	consciousness: faWavePulse,
	affect: faHeart,
	cognition: faBrain,
	memory: faDatabase,
	relationship: faUsers,
	identity: faFingerprint,
	communication: faCommentDots,
	evolution: faSparkles,
};

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const headerVariants: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const staggerContainer: Variants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.06 } },
};

const featureItem: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: EASE },
	},
};

export function FeaturesSection() {
	const t = useTranslations("Features");
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const headerRef = useRef(null);
	const gridRef = useRef(null);
	const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
	const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

	return (
		<section className="border-b border-border/50">
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
						{t("subtitle")}
					</p>
				</motion.div>

				<motion.div
					ref={gridRef}
					initial="hidden"
					animate={gridInView ? "visible" : "hidden"}
					variants={staggerContainer}
					className="relative mt-14 grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
				>
					{FEATURE_KEYS.map((key, idx) => {
						const icon = FEATURE_ICONS[key];
						return (
							<motion.div
								key={key}
								variants={featureItem}
								className="group relative block h-full w-full cursor-pointer p-2"
								onMouseEnter={() => setHoveredIndex(idx)}
								onMouseLeave={() => setHoveredIndex(null)}
							>
								<AnimatePresence mode="wait" initial={false}>
									{hoveredIndex === idx && (
										<motion.span
											className="absolute inset-0 block h-full w-full rounded-2xl border bg-primary/6 border-primary/20 dark:border-primary/10 dark:bg-primary/3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-xl"
											layoutId="featureHover"
											key={idx}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ duration: 0.2 }}
										/>
									)}
								</AnimatePresence>

								<div className="group relative z-10 flex h-full flex-col items-center justify-start gap-3 rounded-2xl p-6 text-center">
									<FontAwesomeIcon
										icon={icon}
										className="text-3xl text-rose-200 group-hover:text-rose-300 transition-colors"
									/>
									<h3 className="font-serif text-xl lg:text-2xl font-medium dark:text-white">
										{t(`${key}Title`)}
									</h3>
									<p className="text-sm leading-relaxed text-muted-foreground">
										{t(`${key}Desc`)}
									</p>
									{key === "identity" && (
										<Link
											href="/seed"
											className="mt-2 inline-flex items-center gap-2 rounded-lg border border-border/50 bg-background/80 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:text-foreground"
										>
											{t("identityLink")}
											<span aria-hidden="true">&rarr;</span>
										</Link>
									)}
								</div>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
}
