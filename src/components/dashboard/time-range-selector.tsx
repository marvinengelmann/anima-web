"use client";

import { faEllipsis } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { TimeRange } from "@/lib/types";

const QUICK_RANGES: TimeRange[] = ["24h", "7d", "30d", "all"];
const MORE_RANGES: TimeRange[] = ["48h", "14d", "90d", "6mo", "1y"];

interface TimeRangeSelectorProps {
	value: TimeRange;
}

export function TimeRangeSelector({ value }: TimeRangeSelectorProps) {
	const t = useTranslations("TimeRange");
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	function handleChange(range: string) {
		const params = new URLSearchParams(searchParams.toString());
		params.set("range", range);
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	}

	const isMoreActive = MORE_RANGES.includes(value);

	return (
		<div className="flex items-center gap-1">
			{QUICK_RANGES.map((range) => (
				<button
					type="button"
					key={range}
					onClick={() => handleChange(range)}
					className={`cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors ${
						value === range
							? "dark:bg-taupe-800 bg-taupe-200 dark:text-taupe-50 text-taupe-950"
							: "text-muted-foreground dark:hover:bg-taupe-900 hover:bg-taupe-100 hover:text-foreground"
					}`}
				>
					{t(range)}
				</button>
			))}
			<DropdownMenu>
				<DropdownMenuTrigger
					id="time-range-more-trigger"
					className={`flex items-center justify-center rounded-md px-2 py-1 text-xs transition-colors ${
						isMoreActive
							? "bg-primary text-primary-foreground"
							: "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
					}`}
				>
					{isMoreActive ? (
						t(value)
					) : (
						<FontAwesomeIcon icon={faEllipsis} className="h-3 w-3" />
					)}
				</DropdownMenuTrigger>
				<DropdownMenuContent align="center" className="w-28">
					<DropdownMenuRadioGroup value={value} onValueChange={handleChange}>
						{MORE_RANGES.map((range) => (
							<DropdownMenuRadioItem
								key={range}
								value={range}
								className="text-xs"
							>
								{t(range)}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
