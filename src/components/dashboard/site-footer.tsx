import { useTranslations } from "next-intl"
import { Github } from "lucide-react"

export function SiteFooter() {
  const t = useTranslations("Footer")

  return (
    <footer className="border-t border-border/50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="font-serif text-base">ANIMA</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/marvinengelmann/anima"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" />
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
  )
}
