"use client";

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/dashboard/language-switcher";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

interface SiteHeaderProps {
	left?: ReactNode;
	center?: ReactNode;
	right?: ReactNode;
}

export function SiteHeader({ left, center, right }: SiteHeaderProps) {
	return (
		<header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
			<div className="container flex flex-col gap-2 py-2">
				<div className="flex items-center justify-between">
					{left ?? (
						<Link href="/">
							<Logo className="h-4 text-black dark:text-white" animated />
						</Link>
					)}
					{center && <div className="hidden sm:block">{center}</div>}
					<div className="flex items-center gap-3">
						{right}
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
				{center && (
					<div className="flex justify-center sm:hidden">{center}</div>
				)}
			</div>
		</header>
	);
}
