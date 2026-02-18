import {
  startOfDay,
  subDays,
  format,
  isAfter,
  isEqual,
} from 'date-fns'
import type { CandidateApplicationListItem } from '@/actions/applications'

// ── Types ──────────────────────────────────────────────────────────

export interface ChartDataPoint {
  date: string
  applications: number
}

export interface DerivedActivity {
  id: string
  type: 'applied' | 'status_change' | 'interview'
  title: string
  description: string
  timestamp: string
}

export interface StatTrends {
  applications: string
  active: string
  interviews: string
  saved: string
}

// ── Chart data ─────────────────────────────────────────────────────

export function buildWeeklyChartData(
  applications: CandidateApplicationListItem[]
): ChartDataPoint[] {
  const today = startOfDay(new Date())
  const days: ChartDataPoint[] = []

  for (let i = 6; i >= 0; i--) {
    const day = subDays(today, i)
    const label = format(day, 'EEE')
    const count = applications.filter((app) => {
      const appDay = startOfDay(new Date(app.appliedAt))
      return isEqual(appDay, day)
    }).length
    days.push({ date: label, applications: count })
  }

  return days
}

// ── Activity feed ──────────────────────────────────────────────────

export function deriveActivityFeed(
  applications: CandidateApplicationListItem[]
): DerivedActivity[] {
  const activities: DerivedActivity[] = []

  for (const app of applications) {
    const companyName = app.company?.name ?? 'Unknown'

    // Every application → "applied" event
    activities.push({
      id: `${app.id}-applied`,
      type: 'applied',
      title: `Applied to ${app.job.title}`,
      description: `${companyName} — ${app.job.location ?? 'Remote'}`,
      timestamp: new Date(app.appliedAt).toISOString(),
    })

    // Status-based events
    if (app.status === 'interviewing') {
      activities.push({
        id: `${app.id}-interview`,
        type: 'interview',
        title: 'Interview stage reached',
        description: `${app.job.title} at ${companyName}`,
        timestamp: new Date(app.appliedAt).toISOString(),
      })
    }

    if (app.status === 'under_review') {
      activities.push({
        id: `${app.id}-review`,
        type: 'status_change',
        title: 'Application under review',
        description: `${app.job.title} at ${companyName}`,
        timestamp: new Date(app.appliedAt).toISOString(),
      })
    }

    if (app.status === 'hired') {
      activities.push({
        id: `${app.id}-offer`,
        type: 'status_change',
        title: 'Offer received',
        description: `${app.job.title} at ${companyName}`,
        timestamp: new Date(app.appliedAt).toISOString(),
      })
    }
  }

  // Sort by date desc, take first 8
  activities.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return activities.slice(0, 8)
}

// ── Stat trends ────────────────────────────────────────────────────

export function computeStatTrends(
  applications: CandidateApplicationListItem[],
  savedCount: number
): StatTrends {
  const weekAgo = subDays(startOfDay(new Date()), 7)

  const appliedThisWeek = applications.filter((app) =>
    isAfter(new Date(app.appliedAt), weekAgo)
  ).length

  const inReview = applications.filter(
    (a) => a.status === 'under_review'
  ).length

  const interviewing = applications.filter(
    (a) => a.status === 'interviewing'
  ).length

  return {
    applications:
      appliedThisWeek > 0 ? `+${appliedThisWeek} this week` : 'No new this week',
    active: inReview > 0 ? `${inReview} in review` : 'None in review',
    interviews:
      interviewing > 0 ? `${interviewing} in progress` : 'None scheduled',
    saved: savedCount > 0 ? `${savedCount} saved` : 'None saved',
  }
}
