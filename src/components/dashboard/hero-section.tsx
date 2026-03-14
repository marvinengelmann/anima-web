"use client";

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useInView, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { Waves } from "@/components/ui/wave-background";

const PHASES = ["sense", "feel", "deliberate", "act", "maintain"] as const;

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function HeroSection() {
	const t = useTranslations("Hero");
	const textRef = useRef(null);
	const gridRef = useRef(null);
	const textInView = useInView(textRef, { once: true, margin: "-80px" });
	const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

	return (
		<section className="relative overflow-hidden border-b border-border/50 bg-white dark:bg-background">
			<div className="absolute inset-0 z-0">
				<Waves
					strokeColor="var(--color-border)"
					backgroundColor="transparent"
					pointerSize={0.5}
				/>
			</div>

			<div className="relative z-10 container flex flex-col gap-16 md:gap-17 lg:gap-18">
				<motion.div
					ref={textRef}
					initial="hidden"
					animate={textInView ? "visible" : "hidden"}
					variants={fadeUp}
					className="max-w-4xl flex flex-col items-start gap-7 md:gap-8 lg:gap-9"
				>
					<p className="text-sm md:text-base lg:text-lg font-light tracking-widest text-foreground dark:text-white uppercase">
						{t("tagline")}
					</p>
					<h1 className="text-4xl md:text-5xl lg:text-6xl dark-text-white">
						{t("heading")}
					</h1>
					<a
						href="https://github.com/marvinengelmann/anima"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex cursor-pointer items-center gap-3 rounded-lg border border-border/50 bg-background/80 p-9 backdrop-blur-xl transition-all duration-300 hover:bg-background/40 px-6 py-3 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground"
					>
						<FontAwesomeIcon icon={faGithub} className="h-5 w-5" />
						{t("github")}
					</a>
				</motion.div>

				<motion.div
					ref={gridRef}
					initial="hidden"
					animate={gridInView ? "visible" : "hidden"}
					variants={fadeUp}
					className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/50 bg-border/50 sm:grid-cols-2 lg:grid-cols-5 sm:[&>:last-child]:col-span-2 lg:[&>:last-child]:col-span-1"
				>
					{PHASES.map((phase, i) => (
						<div
							key={phase}
							className="group relative flex cursor-default flex-col gap-3 lg:gap-6 bg-background/60 p-6 lg:p-9 backdrop-blur-lg transition-all duration-300 hover:bg-background/30"
						>
							<div className="text-sm md:text-base lg:text-md tabular-nums dark:text-rose-200 text-rose-400 font-mono dark:group-hover:text-rose-300 group-hover:text-rose-600 transition-all duration-300">
								{String(i + 1).padStart(2, "0")}
							</div>
							<div className="font-serif text-xl lg:text-2xl font-medium dark-text-white">
								{t(phase)}
							</div>
							<div className="text-sm leading-relaxed text-muted-foreground">
								{t(`${phase}Desc`)}
							</div>
							<div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
						</div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
