"use client"

import { faArrowLeft, faDice, faLink } from "@fortawesome/pro-light-svg-icons"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Logo } from "@/components/logo"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useRef, useState } from "react"
import { generateDNA, generateRandomSeed, isValidSeed } from "@/lib/seed/generate"
import type { GenesisDNA } from "@/lib/seed/types"
import { LanguageSwitcher } from "@/components/dashboard/language-switcher"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { SiteFooter } from "@/components/dashboard/site-footer"
import { Waves } from "@/components/ui/wave-background"
import { Link } from "@/i18n/navigation"
import { AestheticsSection } from "./sections/aesthetics-section"
import { BigFiveSection } from "./sections/big-five-section"
import { CommunicationSection } from "./sections/communication-section"
import { EmotionalBaselineSection } from "./sections/emotional-baseline-section"
import { InterestsSection } from "./sections/interests-section"
import { MbtiBadge } from "./sections/mbti-badge"
import { SelfConceptSection } from "./sections/self-concept-section"
import { ValuesSection } from "./sections/values-section"
import { VoiceSection } from "./sections/voice-section"

const EASE = [0.25, 0.46, 0.45, 0.94] as const

interface ConsciousnessGeneratorProps {
  initialSeed?: string
}

export function ConsciousnessGenerator({ initialSeed }: ConsciousnessGeneratorProps) {
  const t = useTranslations("Seed")
  const [input, setInput] = useState(initialSeed ?? "")
  const [dna, setDna] = useState<GenesisDNA | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const generate = useCallback(async (seed: string) => {
    if (!isValidSeed(seed)) {
      setError(true)
      setDna(null)
      return
    }
    setError(false)
    setLoading(true)
    const result = await generateDNA(seed)
    setDna(result)
    setLoading(false)

    const url = new URL(window.location.href)
    url.searchParams.set("s", seed)
    window.history.replaceState(null, "", url.toString())

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }, [])

  const handleRandom = useCallback(async () => {
    const seed = generateRandomSeed()
    setInput(seed)
    setError(false)
    await generate(seed)
  }, [generate])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    generate(input.trim().toLowerCase())
  }, [generate, input])

  const handleShare = useCallback(async () => {
    const url = new URL(window.location.href)
    await navigator.clipboard.writeText(url.toString())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  useEffect(() => {
    if (initialSeed && isValidSeed(initialSeed)) {
      generate(initialSeed)
    }
  }, [initialSeed, generate])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
            <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
            <Logo className="h-4 text-black dark:text-white" />
          </Link>
          <div className="flex items-center gap-3">
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
      </header>

      <section className="relative overflow-hidden border-b border-border/50 bg-white dark:bg-background">
        <div className="absolute inset-0 z-0">
          <Waves strokeColor="var(--color-border)" backgroundColor="transparent" pointerSize={0.5} />
        </div>

        <div className="relative z-10 container flex flex-col items-center gap-10 py-20 md:py-28 lg:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex flex-col items-center gap-5 max-w-3xl"
          >
            <p className="text-sm md:text-base font-light tracking-widest text-foreground uppercase">
              {t("title")}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl">
              {t("heading")}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {t("description")}
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 w-full max-w-lg"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setError(false)
                }}
                placeholder={t("inputPlaceholder")}
                spellCheck={false}
                autoComplete="off"
                className={`w-full rounded-xl border bg-background/80 backdrop-blur-xl px-5 py-3.5 text-center font-mono text-lg tracking-wider placeholder:text-muted-foreground/50 transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/30 ${
                  error ? "border-red-500/50 ring-2 ring-red-500/20" : "border-border/50 hover:border-border"
                }`}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-500"
                >
                  {t("invalidSeed")}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg border border-border/50 bg-background/80 backdrop-blur-xl px-6 py-2.5 text-sm text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {t("generate")}
              </button>
              <button
                type="button"
                onClick={handleRandom}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/80 backdrop-blur-xl px-6 py-2.5 text-sm text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <FontAwesomeIcon icon={faDice} className="h-3.5 w-3.5" />
                {t("random")}
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {dna && (
          <motion.section
            ref={resultsRef}
            key={dna.seed}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="bg-muted"
          >
            <div className="container flex flex-col gap-3">
              <div className="flex items-center justify-between pt-2">
                <p className="font-mono text-sm text-muted-foreground tracking-wider">
                  {dna.seed}
                </p>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-3 py-1.5 text-xs text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-foreground cursor-pointer"
                >
                  <FontAwesomeIcon icon={faLink} className="h-3 w-3" />
                  {copied ? t("copied") : t("share")}
                </button>
              </div>

              <MbtiBadge type={dna.personalityType} delay={0} />

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <BigFiveSection bigFive={dna.bigFive} delay={0.08} />
                <EmotionalBaselineSection baseline={dna.emotionalBaseline} delay={0.16} />
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <ValuesSection values={dna.valueHierarchy} delay={0.24} />
                <InterestsSection interests={dna.interestSeeds} delay={0.32} />
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <CommunicationSection style={dna.communicationStyle} delay={0.4} />
                <AestheticsSection preferences={dna.aestheticPreferences} delay={0.48} />
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <SelfConceptSection concept={dna.initialSelfConcept} delay={0.56} />
                <VoiceSection voice={dna.voiceCharacteristics} delay={0.64} />
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  )
}
