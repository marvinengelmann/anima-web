import { fetchSystemHealth, fetchRegisterData, fetchLifecyclePhase, fetchDreamData, fetchGenesisData, fetchAlteredState } from "@/lib/data"
import { SystemHealthBadge } from "../system-health-badge"
import { RegisterBadge } from "../register-badge"
import { LifecycleBadge } from "../lifecycle-badge"
import { AlteredBadge } from "../altered-badge"
import { DreamBadge } from "../dream-badge"
import { MbtiBadge, SeedBadge } from "../genesis-badge"

export async function StatusBarSection() {
  const [health, register, lifecycle, altered, dream, genesis] = await Promise.all([
    fetchSystemHealth(),
    fetchRegisterData(),
    fetchLifecyclePhase(),
    fetchAlteredState(),
    fetchDreamData(),
    fetchGenesisData(),
  ])

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-2 rounded-2xl border border-border/50 bg-background/80 px-5 py-3 text-sm backdrop-blur-sm">
      <SystemHealthBadge status={health ?? "unknown"} />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {register && <RegisterBadge register={register} />}
        <LifecycleBadge event={lifecycle} />
        {altered && <AlteredBadge data={altered} />}
        <DreamBadge data={dream} />
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {genesis && <MbtiBadge personalityType={genesis.personalityType} />}
        {genesis && <SeedBadge seed={genesis.seed} />}
      </div>
    </div>
  )
}
