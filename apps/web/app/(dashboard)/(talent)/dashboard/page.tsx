'use client'

import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { formatDistanceToNow } from 'date-fns'
import {
  Briefcase,
  DocumentText,
  Calendar,
  Bookmark,
  Clock,
  TickCircle,
  Messages,
  Profile,
} from '@hackhyre/ui/icons'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@hackhyre/ui/components/chart'
import { Badge } from '@hackhyre/ui/components/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@hackhyre/ui/components/table'
import { Skeleton } from '@hackhyre/ui/components/skeleton'

import { StatCard } from '@/components/dashboard/stat-card'
import { APPLICATION_STATUS_CONFIG } from '@/lib/constants'
import { cn } from '@hackhyre/ui/lib/utils'
import type { Icon } from '@hackhyre/ui/icons'
import { useSession } from '@/lib/auth-client'
import { useApplications } from '@/hooks/use-applications'
import { useSavedJobIds } from '@/hooks/use-saved-jobs'
import type { CandidateApplicationListItem } from '@/actions/applications'
import {
  buildWeeklyChartData,
  deriveActivityFeed,
  computeStatTrends,
  type ChartDataPoint,
  type DerivedActivity,
} from '@/lib/dashboard-utils'

// ── Chart config ──────────────────────────────────────────────────

const chartConfig = {
  applications: {
    label: 'Applications',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

function CandidateApplicationsChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Applications This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-55 w-full">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="fillCandidateApps"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              className="text-muted-foreground text-xs"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              className="text-muted-foreground text-xs"
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#fillCandidateApps)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// ── Recent applications table ─────────────────────────────────────

function CandidateRecentApplications({
  applications,
}: {
  applications: CandidateApplicationListItem[]
}) {
  const recent = applications.slice(0, 5)

  if (recent.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Recent Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <DocumentText
              size={32}
              variant="Linear"
              className="text-muted-foreground/30 mb-2"
            />
            <p className="text-muted-foreground text-[13px]">
              No applications yet
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Recent Applications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6 text-[12px]">Company</TableHead>
              <TableHead className="text-[12px]">Job Title</TableHead>
              <TableHead className="text-[12px]">Status</TableHead>
              <TableHead className="pr-6 text-right text-[12px]">
                Applied
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((app) => {
              const statusConfig = APPLICATION_STATUS_CONFIG[app.status]
              return (
                <TableRow key={app.id}>
                  <TableCell className="pl-6 text-[13px] font-medium">
                    {app.company?.name ?? 'Unknown'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-[13px]">
                    {app.job.title}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        statusConfig?.variant as
                          | 'default'
                          | 'secondary'
                          | 'outline'
                      }
                      className={cn(
                        'text-[10px] font-semibold',
                        statusConfig?.className
                      )}
                    >
                      {statusConfig?.label ?? app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground pr-6 text-right text-[13px]">
                    {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// ── Activity feed ─────────────────────────────────────────────────

const ACTIVITY_ICON_MAP: Record<string, { icon: Icon; className: string }> = {
  applied: { icon: Briefcase, className: 'bg-blue-500/10 text-blue-600' },
  status_change: {
    icon: TickCircle,
    className: 'bg-emerald-500/10 text-emerald-600',
  },
  interview: { icon: Calendar, className: 'bg-violet-500/10 text-violet-600' },
  message: { icon: Messages, className: 'bg-amber-500/10 text-amber-600' },
  profile_view: { icon: Profile, className: 'bg-pink-500/10 text-pink-600' },
}

function CandidateActivityFeed({
  activities,
}: {
  activities: DerivedActivity[]
}) {
  if (activities.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock
              size={32}
              variant="Linear"
              className="text-muted-foreground/30 mb-2"
            />
            <p className="text-muted-foreground text-[13px]">
              No activity yet
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {activities.map((activity, i) => {
          const config = ACTIVITY_ICON_MAP[activity.type]
          const ActivityIcon = config?.icon ?? Clock
          const iconClass =
            config?.className ?? 'bg-muted text-muted-foreground'

          return (
            <div key={activity.id} className="flex gap-3 py-2.5">
              {/* Timeline line + icon */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    iconClass
                  )}
                >
                  <ActivityIcon size={14} variant="Bold" />
                </div>
                {i < activities.length - 1 && (
                  <div className="bg-border mt-1 w-px flex-1" />
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pb-1">
                <p className="text-[13px] leading-tight font-medium">
                  {activity.title}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[12px] leading-tight">
                  {activity.description}
                </p>
                <p className="text-muted-foreground/60 mt-1 text-[11px]">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ── Loading skeleton ──────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-[540px] rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────

export default function CandidateDashboardPage() {
  const { data: session, isPending: sessionLoading } = useSession()
  const { data: appData, isLoading: appsLoading } = useApplications()
  const { data: savedIds, isLoading: savedLoading } = useSavedJobIds()

  const applications = appData?.applications ?? []
  const stats = appData?.stats ?? {
    total: 0,
    active: 0,
    interviewing: 0,
    offers: 0,
  }
  const savedCount = savedIds?.length ?? 0

  const chartData = useMemo(
    () => buildWeeklyChartData(applications),
    [applications]
  )
  const activities = useMemo(
    () => deriveActivityFeed(applications),
    [applications]
  )
  const trends = useMemo(
    () => computeStatTrends(applications, savedCount),
    [applications, savedCount]
  )

  if (sessionLoading || appsLoading || savedLoading) {
    return <DashboardSkeleton />
  }

  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-mono text-2xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Welcome back, {firstName}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DocumentText}
          label="Applications"
          value={String(stats.total)}
          trend={trends.applications}
          index={0}
        />
        <StatCard
          icon={Briefcase}
          label="Active"
          value={String(stats.active)}
          trend={trends.active}
          index={1}
        />
        <StatCard
          icon={Calendar}
          label="Interviews"
          value={String(stats.interviewing)}
          trend={trends.interviews}
          index={2}
        />
        <StatCard
          icon={Bookmark}
          label="Saved Jobs"
          value={String(savedCount)}
          trend={trends.saved}
          index={3}
        />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <CandidateApplicationsChart data={chartData} />
          <CandidateRecentApplications applications={applications} />
        </div>
        <div className="lg:col-span-2">
          <CandidateActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  )
}
