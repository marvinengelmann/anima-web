import { Suspense } from "react";
import { AnalyticsHeader } from "@/components/dashboard/analytics-header";
import { AutoRefresh } from "@/components/dashboard/auto-refresh";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { FeaturesSection } from "@/components/dashboard/features-section";
import { HeroSection } from "@/components/dashboard/hero-section";
import { AfterglowSection } from "@/components/dashboard/sections/afterglow-section";
import { AttachmentSection } from "@/components/dashboard/sections/attachment-section";
import { CognitiveSection } from "@/components/dashboard/sections/cognitive-section";
import { CoherenceSection } from "@/components/dashboard/sections/coherence-section";
import { DreamSection } from "@/components/dashboard/sections/dream-section";
import { DriveSection } from "@/components/dashboard/sections/drive-section";
import { EmotionalFlowSection } from "@/components/dashboard/sections/emotional-flow-section";
import { EventTimelineSection } from "@/components/dashboard/sections/event-timeline-section";
import { FreeEnergySection } from "@/components/dashboard/sections/free-energy-section";
import { InnerVoicesSection } from "@/components/dashboard/sections/inner-voices-section";
import { NeuromodulationSection } from "@/components/dashboard/sections/neuromodulation-section";
import { RegulationSection } from "@/components/dashboard/sections/regulation-section";
import { ResourceMomentumSection } from "@/components/dashboard/sections/resource-momentum-section";
import { SecondarySection } from "@/components/dashboard/sections/secondary-section";
import { SelfConceptSection } from "@/components/dashboard/sections/self-concept-section";
import { SomaticSection } from "@/components/dashboard/sections/somatic-section";
import { StatusBarSection } from "@/components/dashboard/sections/status-bar-section";
import { SiteFooter } from "@/components/dashboard/site-footer";
import {
	AfterglowSkeleton,
	AttachmentSkeleton,
	CognitiveSkeleton,
	CoherenceSkeleton,
	DreamSkeleton,
	DriveSkeleton,
	EmotionalFlowSkeleton,
	EventTimelineSkeleton,
	FreeEnergySkeleton,
	InnerVoicesSkeleton,
	NeuromodulationSkeleton,
	RegulationSkeleton,
	ResourceMomentumSkeleton,
	SecondarySkeleton,
	SelfConceptSkeleton,
	SomaticRadarSkeleton,
	StatusBarSkeleton,
} from "@/components/dashboard/skeletons";
import { FadeIn } from "@/components/ui/fade-in";
import { TIME_RANGES, type TimeRange } from "@/lib/types";

interface PageProps {
	searchParams: Promise<{ range?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
	const { range: rawRange } = await searchParams;
	const range: TimeRange = TIME_RANGES.includes(rawRange as TimeRange)
		? (rawRange as TimeRange)
		: "24h";

	return (
		<div className="min-h-screen bg-background">
			<DashboardHeader range={range} />

			<HeroSection />
			<FeaturesSection />
			<AutoRefresh />

			<section className="bg-muted">
				<div className="container flex flex-col gap-3">
					<FadeIn>
						<AnalyticsHeader />
					</FadeIn>

					<FadeIn>
						<Suspense fallback={<StatusBarSkeleton />}>
							<StatusBarSection />
						</Suspense>
					</FadeIn>

					<FadeIn>
						<Suspense fallback={<EmotionalFlowSkeleton />}>
							<EmotionalFlowSection range={range} />
						</Suspense>
					</FadeIn>

					<FadeIn className="grid grid-cols-1 gap-3 lg:grid-cols-2">
						<Suspense fallback={<ResourceMomentumSkeleton />}>
							<ResourceMomentumSection range={range} />
						</Suspense>
					</FadeIn>

					<FadeIn className="grid grid-cols-1 gap-3 lg:grid-cols-2">
						<Suspense fallback={<SomaticRadarSkeleton />}>
							<SomaticSection range={range} />
						</Suspense>
						<Suspense fallback={<DriveSkeleton />}>
							<DriveSection />
						</Suspense>
					</FadeIn>

					<FadeIn>
						<Suspense fallback={<SecondarySkeleton />}>
							<SecondarySection />
						</Suspense>
					</FadeIn>

					<FadeIn className="grid grid-cols-1 gap-3 lg:grid-cols-2">
						<Suspense fallback={<NeuromodulationSkeleton />}>
							<NeuromodulationSection />
						</Suspense>
						<Suspense fallback={<FreeEnergySkeleton />}>
							<FreeEnergySection />
						</Suspense>
					</FadeIn>

					<FadeIn className="grid grid-cols-1 gap-3 lg:grid-cols-2">
						<Suspense fallback={<AttachmentSkeleton />}>
							<AttachmentSection />
						</Suspense>
						<Suspense fallback={<SelfConceptSkeleton />}>
							<SelfConceptSection />
						</Suspense>
					</FadeIn>

					<FadeIn className="grid grid-cols-1 gap-3 lg:grid-cols-2">
						<div className="flex flex-col gap-3">
							<Suspense fallback={<CoherenceSkeleton />}>
								<CoherenceSection />
							</Suspense>
							<Suspense fallback={<InnerVoicesSkeleton />}>
								<InnerVoicesSection />
							</Suspense>
						</div>
						<div className="flex flex-col gap-3">
							<Suspense fallback={<CognitiveSkeleton />}>
								<CognitiveSection />
							</Suspense>
							<Suspense fallback={<DreamSkeleton />}>
								<DreamSection />
							</Suspense>
						</div>
					</FadeIn>

					<FadeIn className="grid grid-cols-1 gap-3 lg:grid-cols-2">
						<Suspense fallback={<RegulationSkeleton />}>
							<RegulationSection />
						</Suspense>
						<Suspense fallback={<AfterglowSkeleton />}>
							<AfterglowSection range={range} />
						</Suspense>
					</FadeIn>
				</div>
			</section>

			<Suspense fallback={<EventTimelineSkeleton />}>
				<EventTimelineSection range={range} />
			</Suspense>

			<SiteFooter />
		</div>
	);
}
