import { subHours, subDays, subMonths, subYears } from "date-fns"

export function getStartDate(range: string): Date {
  const now = new Date()
  switch (range) {
    case "1h": return subHours(now, 1)
    case "3h": return subHours(now, 3)
    case "6h": return subHours(now, 6)
    case "12h": return subHours(now, 12)
    case "24h": return subHours(now, 24)
    case "48h": return subHours(now, 48)
    case "7d": return subDays(now, 7)
    case "14d": return subDays(now, 14)
    case "30d": return subDays(now, 30)
    case "90d": return subDays(now, 90)
    case "6mo": return subMonths(now, 6)
    case "1y": return subYears(now, 1)
    case "all": return new Date(0)
    default: return subHours(now, 24)
  }
}
