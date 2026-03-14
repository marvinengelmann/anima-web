import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";

export function SiteFooter() {
	const t = useTranslations("Footer");

	return (
		<footer className="border-t border-border/50 py-9 md:py-12 lg:py-16 bg-background">
			<div className="container">
				<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
					<div className="flex flex-col items-center gap-1 sm:items-start">
						<Logo className="h-11 text-primary" />
						<p className="font-serif italic text-lg text-muted-foreground tracking-wide">
							{t("description")}
						</p>
					</div>

					<div className="flex items-center gap-4">
						<a
							href="https://github.com/marvinengelmann/anima"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
						>
							<FontAwesomeIcon icon={faGithub} className="h-3.5 w-3.5" />
							GitHub
						</a>
						<span className="text-border">|</span>
						<a
							href="https://engelmann.technology"
							target="_blank"
							rel="noopener noreferrer"
							className="text-xs text-muted-foreground transition-colors hover:text-foreground"
						>
							engelmann.technology
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
