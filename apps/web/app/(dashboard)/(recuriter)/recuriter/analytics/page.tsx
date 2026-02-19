'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import { Badge } from '@hackhyre/ui/components/badge'
import { Skeleton } from '@hackhyre/ui/components/skeleton'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@hackhyre/ui/components/tabs'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@hackhyre/ui/components/chart'
import {
  Chart,
  Clock,
  TickCircle,
  Briefcase,
  MagicStar,
  TrendUp,
  Flash,
  Ranking,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { StatCard } from '@/components/dashboard/stat-card'
import {
  ANALYTICS_STATS,
  APPLICATION_TRENDS,
  HIRING_PIPELINE,
  JOB_PERFORMANCE,
  SOURCE_BREAKDOWN,
  TIME_TO_HIRE,
  AI_INSIGHTS,
  AI_RECOMMENDATIONS,
  AI_TRENDS,
} from '@/lib/mock-analytics'

// ── Icon Map ────────────────────────────────────────────────────────

const STAT_ICONS = { Chart, Clock, TickCircle, Briefcase } as const

// ── Chart Configs ───────────────────────────────────────────────────

const trendChartConfig = {
  applications: { label: 'Applications', color: 'var(--chart-1)' },
  interviews: { label: 'Interviews', color: 'var(--chart-2)' },
  offers: { label: 'Offers', color: 'var(--chart-3)' },
} satisfies ChartConfig

const pipelineChartConfig = {
  count: { label: 'Count', color: 'var(--chart-1)' },
} satisfies ChartConfig

const sourceChartConfig = {
  count: { label: 'Count', color: 'var(--chart-1)' },
  LinkedIn: { label: 'LinkedIn', color: 'var(--chart-1)' },
  Direct: { label: 'Direct', color: 'var(--chart-2)' },
  Referral: { label: 'Referral', color: 'var(--chart-3)' },
  Indeed: { label: 'Indeed', color: 'var(--chart-4)' },
  Other: { label: 'Other', color: 'var(--chart-5)' },
} satisfies ChartConfig

const jobPerfChartConfig = {
  applications: { label: 'Applications', color: 'var(--chart-1)' },
  interviews: { label: 'Interviews', color: 'var(--chart-2)' },
  hires: { label: 'Hires', color: 'var(--chart-3)' },
} satisfies ChartConfig

const timeToHireChartConfig = {
  days: { label: 'Days', color: 'var(--chart-4)' },
} satisfies ChartConfig

// ── Priority colors ─────────────────────────────────────────────────

const PRIORITY_STYLES = {
  high: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  low: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
} as const

// ── Loading Skeleton ────────────────────────────────────────────────

function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-1.5 h-4 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-10 w-64 rounded-lg" />
      <div className="grid gap-4 lg:grid-cols-5">
        <Skeleton className="h-80 rounded-xl lg:col-span-3" />
        <Skeleton className="h-80 rounded-xl lg:col-span-2" />
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </div>
  )
}

// ── AI Health Score Ring ────────────────────────────────────────────

function HealthScoreRing({ score }: { score: number }) {
  const r = 40
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference

  const color =
    score >= 80
      ? 'text-emerald-500'
      : score >= 60
        ? 'text-amber-500'
        : 'text-rose-500'

  const strokeColor =
    score >= 80
      ? 'stroke-emerald-500'
      : score >= 60
        ? 'stroke-amber-500'
        : 'stroke-rose-500'

  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
      <svg
        className="-rotate-90"
        width="96"
        height="96"
        viewBox="0 0 96 96"
      >
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          className="stroke-muted"
          strokeWidth="6"
        />
        <motion.circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          className={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-xl font-bold tabular-nums', color)}>
          {score}
        </span>
        <span className="text-muted-foreground text-[10px]">Health</span>
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) return <AnalyticsLoadingSkeleton />

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-0.5 text-[13px]">
          Hiring insights and performance metrics for your team
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ANALYTICS_STATS.map((stat, i) => (
          <StatCard
            key={stat.label}
            icon={STAT_ICONS[stat.icon]}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            index={i}
          />
        ))}
      </div>

      {/* Tab Switcher */}
      <Tabs defaultValue="ai">
        <TabsList>
          <TabsTrigger value="ai" className="gap-1.5">
            <MagicStar size={14} variant="Bold" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="standard" className="gap-1.5">
            <Chart size={14} variant="Bold" />
            Standard
          </TabsTrigger>
        </TabsList>

        {/* ── AI Insights Tab ──────────────────────────────────────── */}
        <TabsContent value="ai" className="space-y-4">
          {/* AI Summary Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-primary/20 overflow-hidden">
              <div className="from-primary/5 via-transparent to-chart-4/5 bg-gradient-to-br">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-primary/30 bg-primary/10 text-primary gap-1 text-[10px] font-semibold"
                    >
                      <MagicStar size={10} variant="Bold" />
                      AI-Powered Insights
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="text-muted-foreground text-[13px] leading-relaxed">
                        {AI_INSIGHTS.summary}
                      </p>
                    </div>
                    <HealthScoreRing score={AI_INSIGHTS.healthScore} />
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {AI_INSIGHTS.metrics.map((metric, i) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
                        className="bg-background/60 rounded-lg border p-3"
                      >
                        <p className="text-muted-foreground text-[10px]">
                          {metric.label}
                        </p>
                        <p className="mt-0.5 font-mono text-lg font-bold tracking-tight">
                          {metric.value}
                        </p>
                        <p className="flex items-center gap-1 text-[10px] text-emerald-500">
                          <TrendUp size={10} variant="Bold" />
                          {metric.change}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>

          {/* Recommendations + Trends */}
          <div className="grid gap-4 lg:grid-cols-5">
            {/* Recommendations */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                    <Flash size={16} variant="Bold" className="text-primary" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {AI_RECOMMENDATIONS.map((rec, i) => (
                      <motion.div
                        key={rec.title}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.2 + i * 0.05,
                          duration: 0.25,
                        }}
                        className="flex items-start gap-3 rounded-lg border p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-semibold">
                              {rec.title}
                            </p>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[9px] font-semibold uppercase',
                                PRIORITY_STYLES[rec.priority]
                              )}
                            >
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
                            {rec.description}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="shrink-0 text-[10px] font-medium"
                        >
                          {rec.impact}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trend Analysis */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                    <Ranking
                      size={16}
                      variant="Bold"
                      className="text-primary"
                    />
                    Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {AI_TRENDS.map((trend, i) => (
                      <motion.div
                        key={trend.period}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.25 + i * 0.08,
                          duration: 0.25,
                        }}
                      >
                        <Badge
                          variant="secondary"
                          className="mb-1.5 text-[10px] font-semibold"
                        >
                          {trend.period}
                        </Badge>
                        <p className="text-muted-foreground text-[12px] leading-relaxed">
                          {trend.insight}
                        </p>
                        {i < AI_TRENDS.length - 1 && (
                          <div className="mt-4 border-b" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Hiring Funnel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                  <Chart size={16} variant="Bold" className="text-primary" />
                  Hiring Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {HIRING_PIPELINE.map((stage, i) => {
                    const maxCount = HIRING_PIPELINE[0]?.count ?? 1
                    const width = (stage.count / maxCount) * 100

                    return (
                      <div key={stage.stage} className="flex items-center gap-3">
                        <span className="text-muted-foreground w-24 shrink-0 text-[12px] font-medium">
                          {stage.stage}
                        </span>
                        <div className="relative h-8 flex-1 overflow-hidden rounded-md bg-muted">
                          <motion.div
                            className="absolute inset-y-0 left-0 rounded-md"
                            style={{
                              backgroundColor: stage.color,
                              width: `${width}%`,
                              transformOrigin: 'left',
                            }}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{
                              delay: 0.3 + i * 0.08,
                              duration: 0.5,
                              ease: 'easeOut',
                            }}
                          />
                        </div>
                        <span className="w-10 shrink-0 text-right font-mono text-[13px] font-bold tabular-nums">
                          {stage.count}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ── Standard Analytics Tab ───────────────────────────────── */}
        <TabsContent value="standard" className="space-y-4">
          {/* Application Trends */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[15px] font-semibold">
                  Application Trends
                </CardTitle>
                <p className="text-muted-foreground text-[11px]">
                  Weekly applications, interviews, and offers over 12 weeks
                </p>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={trendChartConfig}
                  className="h-[280px] w-full"
                >
                  <AreaChart
                    data={APPLICATION_TRENDS}
                    margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="fillApps"
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
                      <linearGradient
                        id="fillInterviews"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--chart-2)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--chart-2)"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillOffers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--chart-3)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--chart-3)"
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
                      dataKey="week"
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
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                      fill="url(#fillApps)"
                    />
                    <Area
                      type="monotone"
                      dataKey="interviews"
                      stroke="var(--chart-2)"
                      strokeWidth={2}
                      fill="url(#fillInterviews)"
                    />
                    <Area
                      type="monotone"
                      dataKey="offers"
                      stroke="var(--chart-3)"
                      strokeWidth={2}
                      fill="url(#fillOffers)"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pipeline + Source Breakdown */}
          <div className="grid gap-4 lg:grid-cols-5">
            {/* Hiring Pipeline Chart */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[15px] font-semibold">
                    Hiring Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={pipelineChartConfig}
                    className="h-[250px] w-full"
                  >
                    <BarChart
                      data={HIRING_PIPELINE}
                      layout="vertical"
                      margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        className="stroke-border"
                      />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        className="text-muted-foreground text-xs"
                      />
                      <YAxis
                        dataKey="stage"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        width={80}
                        className="text-muted-foreground text-xs"
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        cursor={false}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {HIRING_PIPELINE.map((entry) => (
                          <Cell key={entry.stage} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Source Breakdown Donut */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[15px] font-semibold">
                    Source Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={sourceChartConfig}
                    className="mx-auto h-[250px] w-full"
                  >
                    <PieChart>
                      <ChartTooltip
                        content={<ChartTooltipContent nameKey="source" />}
                      />
                      <Pie
                        data={SOURCE_BREAKDOWN}
                        dataKey="count"
                        nameKey="source"
                        innerRadius={60}
                        outerRadius={90}
                        strokeWidth={2}
                        stroke="var(--background)"
                      >
                        {SOURCE_BREAKDOWN.map((entry) => (
                          <Cell key={entry.source} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  {/* Legend */}
                  <div className="mt-2 flex flex-wrap justify-center gap-3">
                    {SOURCE_BREAKDOWN.map((s) => (
                      <div
                        key={s.source}
                        className="flex items-center gap-1.5 text-[11px]"
                      >
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: s.fill }}
                        />
                        <span className="text-muted-foreground">
                          {s.source}
                        </span>
                        <span className="font-mono font-semibold tabular-nums">
                          {s.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Job Performance + Time to Hire */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Job Performance */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-[15px] font-semibold">
                    Job Performance
                  </CardTitle>
                  <p className="text-muted-foreground text-[11px]">
                    Applications, interviews, and hires per role
                  </p>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={jobPerfChartConfig}
                    className="h-[280px] w-full"
                  >
                    <BarChart
                      data={JOB_PERFORMANCE}
                      margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        className="stroke-border"
                      />
                      <XAxis
                        dataKey="title"
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
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        cursor={false}
                      />
                      <Bar
                        dataKey="applications"
                        fill="var(--chart-1)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="interviews"
                        fill="var(--chart-2)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="hires"
                        fill="var(--chart-3)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Time to Hire */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-[15px] font-semibold">
                    Time to Hire
                  </CardTitle>
                  <p className="text-muted-foreground text-[11px]">
                    Average days from application to offer per role
                  </p>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={timeToHireChartConfig}
                    className="h-[280px] w-full"
                  >
                    <BarChart
                      data={TIME_TO_HIRE}
                      margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        className="stroke-border"
                      />
                      <XAxis
                        dataKey="role"
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
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        cursor={false}
                      />
                      <Bar
                        dataKey="days"
                        fill="var(--chart-4)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
