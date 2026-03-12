import { fetchSystemHealth, fetchRegisterData } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SystemHealthBadge } from "../system-health-badge"
import { RegisterBadge } from "../register-badge"

export async function StatusBarSection() {
  const [health, register] = await Promise.all([
    fetchSystemHealth(),
    fetchRegisterData(),
  ])

  if (!health && !register) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>System</CardTitle>
        <CardDescription>Health & communication status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {health && <SystemHealthBadge status={health} />}
        {register && <RegisterBadge register={register} />}
      </CardContent>
    </Card>
  )
}
