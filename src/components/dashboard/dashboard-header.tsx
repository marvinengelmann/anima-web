"use client";

import { faDna } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";
import { SiteHeader } from "@/components/site-header";
import { Link } from "@/i18n/navigation";
import type { TimeRange } from "@/lib/types";
import { TimeRangeSelector } from "./time-range-selector";

interface DashboardHeaderProps {
	range: TimeRange;
}

export function DashboardHeader({ range }: DashboardHeaderProps) {
	const t = useTranslations("Dashboard");

	return (
		<SiteHeader
			left={
				<div className="flex items-center gap-3">
					<Link href="/">
						<Logo className="h-4 text-black dark:text-white" animated />
					</Link>
					<div className="flex items-center gap-1.5">
						<div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
						<span className="text-[11px] text-muted-foreground">
							{t("liveIndicator")}
						</span>
					</div>
				</div>
			}
			center={<TimeRangeSelector value={range} />}
			right={
				<Link
					href="/seed"
					className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
				>
					<FontAwesomeIcon icon={faDna} className="h-3.5 w-3.5" />
				</Link>
			}
		/>
	);
}
