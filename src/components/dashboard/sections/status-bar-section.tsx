import { fetchSystemHealth, fetchRegisterData, fetchLifecyclePhase } from "@/lib/data"
import { SystemHealthBadge } from "../system-health-badge"
import { RegisterBadge } from "../register-badge"
import { LifecycleBadge } from "../lifecycle-badge"

export async function StatusBarSection() {
  const [health, register, lifecycle] = await Promise.all([
    fetchSystemHealth(),
    fetchRegisterData(),
    fetchLifecyclePhase(),
  ])

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-border/50 bg-background/80 px-5 py-3 text-sm backdrop-blur-sm">
      <SystemHealthBadge status={health ?? "unknown"} />
      {register && <RegisterBadge register={register} />}
      <LifecycleBadge event={lifecycle} />
    </div>
  )
}
