'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import { Badge } from '@hackhyre/ui/components/badge'
import { Input } from '@hackhyre/ui/components/input'
import { Button } from '@hackhyre/ui/components/button'
import { Avatar, AvatarFallback } from '@hackhyre/ui/components/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hackhyre/ui/components/select'
import {
  People,
  Star,
  Calendar,
  TickCircle,
  Location,
  Briefcase,
  SearchNormal,
  ArrowRight,
  MagicStar,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import {
  MOCK_CANDIDATES,
  MOCK_APPLICATIONS,
  type ApplicationStatus,
} from '@/lib/mock-data'
import { APPLICATION_STATUS_CONFIG } from '@/lib/constants'
import { StatCard } from '@/components/dashboard/stat-card'

// ── Status priority for "best status" derivation ────────────────────
const STATUS_PRIORITY: Record<ApplicationStatus, number> = {
  hired: 5,
  interviewing: 4,
  under_review: 3,
  not_reviewed: 2,
  rejected: 1,
}

// ── Sort helpers ────────────────────────────────────────────────────
type SortKey = 'match' | 'newest' | 'experience' | 'name'

function parseExperience(exp: string) {
  const n = parseInt(exp, 10)
  return isNaN(n) ? 0 : n
}

// ── ScoreRingSmall (48x48) ──────────────────────────────────────────
function ScoreRingSmall({ score }: { score: number }) {
  const percentage = Math.round(score * 100)
  const r = 18
  const circumference = 2 * Math.PI * r
  const offset = circumference - score * circumference

  const color =
    percentage >= 80
      ? 'text-emerald-500'
      : percentage >= 65
        ? 'text-amber-500'
        : 'text-rose-500'

  const strokeColor =
    percentage >= 80
      ? 'stroke-emerald-500'
      : percentage >= 65
        ? 'stroke-amber-500'
        : 'stroke-rose-500'

  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
      <svg className="-rotate-90" width="48" height="48" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          className="stroke-muted"
          strokeWidth="3"
        />
        <motion.circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          className={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn('text-[11px] font-bold tabular-nums', color)}>
          {percentage}%
        </span>
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────
export default function CandidatesPage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('match')

  // Derive per-candidate data from mock data
  const candidates = useMemo(() => {
    return MOCK_CANDIDATES.map((c) => {
      const apps = MOCK_APPLICATIONS.filter((a) => a.candidateId === c.id)
      const scores = apps
        .map((a) => a.relevanceScore)
        .filter((s): s is number => s !== null)
      const bestMatchScore = scores.length > 0 ? Math.max(...scores) : 0
      const bestApp = apps.reduce<(typeof apps)[0] | null>((best, a) => {
        if (a.relevanceScore === null) return best
        if (!best || best.relevanceScore === null) return a
        return a.relevanceScore > best.relevanceScore ? a : best
      }, null)
      const bestStatus = apps.reduce<ApplicationStatus>(
        (best, a) =>
          STATUS_PRIORITY[a.status] > STATUS_PRIORITY[best] ? a.status : best,
        'not_reviewed'
      )

      return {
        ...c,
        bestMatchScore,
        applicationCount: apps.length,
        applications: apps,
        bestStatus,
        bestMatchJobTitle: bestApp?.jobTitle ?? null,
      }
    })
  }, [])

  // Filter
  const filtered = useMemo(() => {
    let result = candidates
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      )
    }
    // Sort
    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'match':
          return b.bestMatchScore - a.bestMatchScore
        case 'newest':
          return (
            Math.max(
              ...b.applications.map((x) => new Date(x.createdAt).getTime()),
              0
            ) -
            Math.max(
              ...a.applications.map((x) => new Date(x.createdAt).getTime()),
              0
            )
          )
        case 'experience':
          return parseExperience(b.experience) - parseExperience(a.experience)
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
    return result
  }, [candidates, search, sort])

  // Stats
  const totalCandidates = candidates.length
  const topMatches = candidates.filter((c) => c.bestMatchScore >= 0.8).length
  const interviewing = candidates.filter(
    (c) => c.bestStatus === 'interviewing'
  ).length
  const hired = candidates.filter((c) => c.bestStatus === 'hired').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Candidates</h1>
        <p className="text-muted-foreground mt-0.5 text-[13px]">
          AI-ranked candidates across all your open positions
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={People}
          label="Total Candidates"
          value={String(totalCandidates)}
          trend={`${totalCandidates} profiles`}
          index={0}
        />
        <StatCard
          icon={MagicStar}
          label="Top Matches"
          value={String(topMatches)}
          trend="Score ≥ 80%"
          index={1}
        />
        <StatCard
          icon={Calendar}
          label="Interviewing"
          value={String(interviewing)}
          trend="In progress"
          index={2}
        />
        <StatCard
          icon={TickCircle}
          label="Hired"
          value={String(hired)}
          trend="Offers accepted"
          index={3}
        />
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-[15px] font-semibold">
              All Candidates
              <span className="text-muted-foreground ml-2 text-[12px] font-normal">
                ({filtered.length})
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative max-w-xs flex-1">
                <SearchNormal
                  size={14}
                  variant="Linear"
                  className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                />
                <Input
                  placeholder="Search name, title, skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-muted/50 focus-visible:bg-background h-8 w-56 rounded-lg border-0 pl-8 text-[12px]"
                />
              </div>
              <Select
                value={sort}
                onValueChange={(v) => setSort(v as SortKey)}
              >
                <SelectTrigger className="h-8 w-40 rounded-lg text-[12px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <People
                size={40}
                variant="Linear"
                className="text-muted-foreground/30 mb-3"
              />
              <p className="text-muted-foreground text-[13px] font-medium">
                No candidates found
              </p>
              <p className="text-muted-foreground/70 mt-1 text-[12px]">
                Try adjusting your search or sort criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((candidate, index) => {
                const initials = candidate.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                const statusConfig =
                  APPLICATION_STATUS_CONFIG[candidate.bestStatus]
                const visibleSkills = candidate.skills.slice(0, 4)
                const overflowCount = candidate.skills.length - 4

                return (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.04,
                      duration: 0.25,
                    }}
                  >
                    <Card className="group hover:border-primary/20 transition-colors">
                      <CardContent className="p-4">
                        {/* Top row: avatar + name | score ring */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-10 w-10 shrink-0">
                              <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-bold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="group-hover:text-primary truncate text-[13px] font-semibold transition-colors">
                                {candidate.name}
                              </p>
                              <p className="text-muted-foreground truncate text-[11px]">
                                {candidate.title}
                              </p>
                            </div>
                          </div>
                          <ScoreRingSmall score={candidate.bestMatchScore} />
                        </div>

                        {/* Meta row */}
                        <div className="text-muted-foreground mt-3 flex items-center gap-3 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Location size={12} variant="Linear" />
                            {candidate.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase size={12} variant="Linear" />
                            {candidate.experience}
                          </span>
                        </div>

                        {/* Skills */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {visibleSkills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="px-2 py-0.5 text-[10px] font-medium"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {overflowCount > 0 && (
                            <Badge
                              variant="outline"
                              className="px-2 py-0.5 text-[10px] font-medium"
                            >
                              +{overflowCount}
                            </Badge>
                          )}
                        </div>

                        {/* Bottom row */}
                        <div className="mt-3 flex items-center justify-between border-t pt-3">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={statusConfig?.variant as 'default'}
                              className={cn(
                                'text-[10px] font-medium',
                                statusConfig?.className
                              )}
                            >
                              {statusConfig?.label}
                            </Badge>
                            <span className="text-muted-foreground text-[11px]">
                              {candidate.applicationCount} job
                              {candidate.applicationCount !== 1 ? 's' : ''}{' '}
                              applied
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground group-hover:text-primary h-7 gap-1 px-2 text-[11px]"
                            asChild
                          >
                            <Link
                              href={`/recuriter/candidates/${candidate.id}`}
                            >
                              View
                              <ArrowRight size={12} variant="Linear" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
