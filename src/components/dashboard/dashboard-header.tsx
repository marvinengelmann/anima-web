"use client";

import { faDna } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
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
			center={<TimeRangeSelector value={range} />}
			right={
				<>
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
				</>
			}
		/>
	);
}
