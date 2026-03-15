"use client";

import {
	faDesktop,
	faMoon,
	faSunBright,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [open, setOpen] = useState(false);

	function handleChange(value: string) {
		setTheme(value);
		setOpen(false);
	}

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger
				id="theme-toggle-trigger"
				className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
			>
				<FontAwesomeIcon
					icon={faSunBright}
					className="h-3.5 w-3.5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"
				/>
				<FontAwesomeIcon
					icon={faMoon}
					className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-32">
				<DropdownMenuRadioGroup value={theme} onValueChange={handleChange}>
					<DropdownMenuRadioItem value="light" className="gap-2 text-xs">
						<FontAwesomeIcon icon={faSunBright} className="h-3.5 w-3.5" />
						Light
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="dark" className="gap-2 text-xs">
						<FontAwesomeIcon icon={faMoon} className="h-3.5 w-3.5" />
						Dark
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="system" className="gap-2 text-xs">
						<FontAwesomeIcon icon={faDesktop} className="h-3.5 w-3.5" />
						System
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
