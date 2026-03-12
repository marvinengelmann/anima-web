import { Suspense } from "react"
import { TIME_RANGES, type TimeRange } from "@/lib/types"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { HeroSection } from "@/components/dashboard/hero-section"
import { FeaturesSection } from "@/components/dashboard/features-section"
import { SiteFooter } from "@/components/dashboard/site-footer"
import { AutoRefresh } from "@/components/dashboard/auto-refresh"
import { EmotionalFlowSection } from "@/components/dashboard/sections/emotional-flow-section"
import { SomaticSection } from "@/components/dashboard/sections/somatic-section"
import { DriveSection } from "@/components/dashboard/sections/drive-section"
import { ResourceMomentumSection } from "@/components/dashboard/sections/resource-momentum-section"
import { SecondarySection } from "@/components/dashboard/sections/secondary-section"
import { AfterglowSection } from "@/components/dashboard/sections/afterglow-section"
import { EventTimelineSection } from "@/components/dashboard/sections/event-timeline-section"
import {
  EmotionalFlowSkeleton,
  SomaticRadarSkeleton,
  DriveSkeleton,
  ResourceMomentumSkeleton,
  SecondarySkeleton,
  AfterglowSkeleton,
  EventTimelineSkeleton,
} from "@/components/dashboard/skeletons"

interface PageProps {
  searchParams: Promise<{ range?: string }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const { range: rawRange } = await searchParams
  const range: TimeRange = TIME_RANGES.includes(rawRange as TimeRange)
    ? (rawRange as TimeRange)
    : "24h"

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader range={range} />
      <HeroSection />
      <FeaturesSection />
      <AutoRefresh />

      <main className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6">
        <Suspense fallback={<EmotionalFlowSkeleton />}>
          <EmotionalFlowSection range={range} />
        </Suspense>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Suspense fallback={<SomaticRadarSkeleton />}>
            <SomaticSection range={range} />
          </Suspense>
          <Suspense fallback={<DriveSkeleton />}>
            <DriveSection />
          </Suspense>
        </div>

        <Suspense fallback={<AfterglowSkeleton />}>
          <AfterglowSection range={range} />
        </Suspense>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Suspense fallback={<ResourceMomentumSkeleton />}>
            <ResourceMomentumSection range={range} />
          </Suspense>
          <Suspense fallback={<SecondarySkeleton />}>
            <SecondarySection />
          </Suspense>
        </div>

        <Suspense fallback={<EventTimelineSkeleton />}>
          <EventTimelineSection range={range} />
        </Suspense>
      </main>

      <SiteFooter />
    </div>
  )
}
