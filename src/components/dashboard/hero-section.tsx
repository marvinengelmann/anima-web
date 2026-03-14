"use client";

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { Waves } from "@/components/ui/wave-background";

const PHASES = ["sense", "feel", "deliberate", "act", "maintain"] as const;

export function HeroSection() {
	const t = useTranslations("Hero");

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
				<div className="max-w-4xl flex flex-col items-start gap-7 md:gap-8 lg:gap-9">
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
				</div>

				<div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/50 bg-border/50 sm:grid-cols-2 lg:grid-cols-5 sm:[&>:last-child]:col-span-2 lg:[&>:last-child]:col-span-1">
					{PHASES.map((phase, i) => (
						<div
							key={phase}
							className="group relative flex cursor-default flex-col gap-3 lg:gap-6 bg-background/60 p-6 lg:p-9 backdrop-blur-lg transition-all duration-300 hover:bg-background/30"
						>
							<div className="text-sm md:text-base lg:text-md tabular-nums text-rose-200 font-mono group-hover:text-rose-300 transition-all duration-300">
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
				</div>
			</div>
		</section>
	);
}
