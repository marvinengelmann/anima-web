"use client";

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faDna } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";
import { Link } from "@/i18n/navigation";
import type { TimeRange } from "@/lib/types";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { TimeRangeSelector } from "./time-range-selector";

interface DashboardHeaderProps {
	range: TimeRange;
}

export function DashboardHeader({ range }: DashboardHeaderProps) {
	const t = useTranslations("Dashboard");

	return (
		<header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
			<div className="container flex flex-col gap-2 py-2">
				<div className="flex items-center justify-between">
					<Logo className="h-10 text-black dark:text-white" />
					<div className="hidden sm:block">
						<TimeRangeSelector value={range} />
					</div>
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-1.5">
							<div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
							<span className="text-[11px] text-muted-foreground">
								{t("liveIndicator")}
							</span>
						</div>
						<Link
							href="/seed"
							className="text-muted-foreground transition-colors hover:text-foreground"
						>
							<FontAwesomeIcon icon={faDna} className="h-4 w-4" />
						</Link>
						<a
							href="https://github.com/marvinengelmann/anima"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground transition-colors hover:text-foreground"
						>
							<FontAwesomeIcon icon={faGithub} className="h-4 w-4" />
						</a>
						<ThemeToggle />
						<LanguageSwitcher />
					</div>
				</div>
				<div className="flex justify-center sm:hidden">
					<TimeRangeSelector value={range} />
				</div>
			</div>
		</header>
	);
}
