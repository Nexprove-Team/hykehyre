'use client'

import { use, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import { Badge } from '@hackhyre/ui/components/badge'
import { Button } from '@hackhyre/ui/components/button'
import { Avatar, AvatarFallback } from '@hackhyre/ui/components/avatar'
import { Separator } from '@hackhyre/ui/components/separator'
import {
  ArrowLeft,
  Briefcase,
  Location,
  Calendar,
  Star,
  TickCircle,
  Sms,
  Call,
  Flag,
  LinkIcon,
  Book,
  MagicStar,
  People,
  Send,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import {
  MOCK_CANDIDATES,
  MOCK_APPLICATIONS,
  MOCK_JOBS,
  type ApplicationStatus,
} from '@/lib/mock-data'
import { APPLICATION_STATUS_CONFIG } from '@/lib/constants'
import type { Icon } from '@hackhyre/ui/icons'

// ── Mock AI Analysis ────────────────────────────────────────────────
const MOCK_AI_ANALYSIS: Record<
  string,
  { feedback: string; strengths: string[]; gaps: string[] }
> = {
  'cand-001': {
    feedback:
      'Alex is an exceptional match for the Senior Frontend Engineer role. With 6 years of React experience at top-tier companies like Stripe and Airbnb, their expertise in component architecture and design systems directly aligns with our needs. Their mentoring experience also demonstrates leadership readiness.',
    strengths: [
      'Deep React and TypeScript expertise with 6+ years of production experience',
      'Proven track record at Stripe building interfaces for 3M+ users',
      'Strong mentoring skills — coached 4 junior engineers',
      'Design system experience directly applicable to our shared component library',
    ],
    gaps: [
      'No direct experience with our specific backend stack (could benefit from onboarding)',
      'GraphQL experience listed but depth unclear — may need to validate in interview',
    ],
  },
  'cand-002': {
    feedback:
      'Priya brings strong full-stack capabilities with a particularly solid React foundation. Her work at Revolut on real-time dashboards for 20M+ users demonstrates she can handle scale. The Python/Django background adds versatility, though the role is frontend-focused.',
    strengths: [
      'Built real-time dashboards at scale (20M+ users at Revolut)',
      'Strong TypeScript and React proficiency',
      'Full-stack perspective helps with API collaboration',
      'Dual M.Sc. and B.Tech education background',
    ],
    gaps: [
      'Frontend experience is 4 years vs. 5+ requirement — borderline but compensated by quality',
      'No specific design system or component library ownership mentioned',
    ],
  },
  'cand-003': {
    feedback:
      'Marcus is a strong backend engineer with impressive distributed systems experience. His work at Datadog on large-scale data ingestion aligns well with our backend needs. The combination of Node.js and Go shows language versatility.',
    strengths: [
      'Built ingestion pipeline handling 10B+ events/day at Datadog',
      'Reduced API latency by 40% through query optimization',
      'Strong distributed systems background from Bloomberg',
      'Kubernetes and gRPC expertise for microservices',
    ],
    gaps: [
      'Primary language is Go — may need ramp-up time on our Node.js/TypeScript stack',
      'No mentioned experience with our specific cloud provider setup',
    ],
  },
  'cand-004': {
    feedback:
      'Sarah is a near-perfect match for the Product Designer role. Her experience leading design at Monzo, combined with her RCA education, positions her as a design leader. The 25% onboarding improvement metric shows she drives measurable outcomes.',
    strengths: [
      'Led onboarding redesign improving completion by 25% at Monzo',
      'Built and maintained a design system at scale',
      'M.A. from Royal College of Art — strong design foundations',
      'Figma and prototyping expertise matches our toolchain',
    ],
    gaps: [
      'Primarily fintech experience — may need to adapt thinking to broader product scope',
    ],
  },
  'cand-005': {
    feedback:
      'David is an early-career developer with solid fundamentals but limited professional experience. While his freelance portfolio shows initiative, the Senior Frontend Engineer role requires significantly more depth and team experience.',
    strengths: [
      'Self-motivated with 15+ completed client projects',
      'React and Tailwind CSS experience aligns with our stack',
    ],
    gaps: [
      'Only 1 year of experience vs. 5+ year requirement — significant gap',
      'No experience in team environments or at scale',
      'Missing TypeScript and Next.js depth required for the role',
    ],
  },
  'cand-006': {
    feedback:
      'Emma is an excellent fit for the Full Stack Developer role. Her 5 years at N26 building customer-facing features and leading architectural migrations demonstrate both technical skill and initiative. The Berlin location aligns perfectly.',
    strengths: [
      'Led monolith-to-microservices migration at N26',
      'Customer verification pipeline for 7M+ users shows scale experience',
      'React, Node.js, TypeScript, PostgreSQL — exact stack match',
      'Based in Berlin — same timezone and location as the role',
    ],
    gaps: [
      'Single company experience (N26) — may need to validate adaptability',
    ],
  },
  'cand-007': {
    feedback:
      'James brings exceptional backend engineering depth with 7 years of experience. His payments infrastructure work at Paystack and fraud detection system are highly impressive. The experience level exceeds the mid-level requirement, making him a strong candidate.',
    strengths: [
      'Built payment processing engine handling $1B+ in transactions',
      'Designed fraud detection system reducing chargebacks by 60%',
      '7 years of experience — exceeds mid-level requirement',
      'AWS and Terraform expertise for infrastructure work',
    ],
    gaps: [
      'May be overqualified for a mid-level role — ensure alignment on scope and growth',
      'Primary database experience is MongoDB — our stack uses PostgreSQL',
    ],
  },
  'cand-008': {
    feedback:
      'Lina has a solid foundation as a full-stack developer with 3 years of experience at JetBrains. Her mathematical background and developer tools experience are unique strengths. Good cultural fit for a remote-first team.',
    strengths: [
      'Built developer tools used by 10M+ developers at JetBrains',
      'React, Node.js, TypeScript — core stack alignment',
      'Docker and CI/CD expertise for modern deployment workflows',
      'Applied mathematics background for analytical thinking',
    ],
    gaps: [
      '3 years of experience is on the lower end for mid-level expectations',
      'Vue.js listed alongside React — may need to confirm React depth',
    ],
  },
}

function getDefaultAnalysis(
  candidate: (typeof MOCK_CANDIDATES)[0],
  bestScore: number
) {
  const pct = Math.round(bestScore * 100)
  return {
    feedback: `${candidate.name} has ${candidate.experience.toLowerCase()} of experience as a ${candidate.title}. Based on their profile and application data, they scored a ${pct}% match overall. Review their detailed background below to assess fit.`,
    strengths: [
      `${candidate.experience} of professional experience`,
      `${candidate.skills.slice(0, 3).join(', ')} expertise`,
    ],
    gaps: [
      'Further evaluation needed to identify specific development areas',
    ],
  }
}

// ── ScoreRing (96x96) ───────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const percentage = Math.round(score * 100)
  const circumference = 2 * Math.PI * 40
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
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
      <svg className="-rotate-90" width="96" height="96" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          className="stroke-muted"
          strokeWidth="6"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
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
          {percentage}%
        </span>
        <span className="text-muted-foreground text-[10px] font-medium">
          Match
        </span>
      </div>
    </div>
  )
}

// ── InfoRow ─────────────────────────────────────────────────────────
function InfoRow({
  icon: IconCmp,
  label,
  value,
}: {
  icon: Icon
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
        <IconCmp size={15} variant="Bold" className="text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
          {label}
        </p>
        <p className="mt-0.5 text-[13px] font-medium">{value}</p>
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────
export default function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const candidate = MOCK_CANDIDATES.find((c) => c.id === id)
  const applications = useMemo(
    () => MOCK_APPLICATIONS.filter((a) => a.candidateId === id),
    [id]
  )

  const bestMatchScore = useMemo(() => {
    const scores = applications
      .map((a) => a.relevanceScore)
      .filter((s): s is number => s !== null)
    return scores.length > 0 ? Math.max(...scores) : 0
  }, [applications])

  // Collect all job skills for match highlighting
  const allJobSkills = useMemo(() => {
    const skills = new Set<string>()
    MOCK_JOBS.forEach((j) => j.skills.forEach((s) => skills.add(s.toLowerCase())))
    return skills
  }, [])

  if (!candidate) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground w-fit gap-2"
          asChild
        >
          <Link href="/recuriter/candidates">
            <ArrowLeft size={16} variant="Linear" />
            Back to Candidates
          </Link>
        </Button>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <People
            size={40}
            variant="Linear"
            className="text-muted-foreground/30 mb-3"
          />
          <p className="text-muted-foreground text-[13px] font-medium">
            Candidate not found
          </p>
          <p className="text-muted-foreground/70 mt-1 text-[12px]">
            This candidate may have been removed or doesn&apos;t exist.
          </p>
        </div>
      </div>
    )
  }

  const analysis =
    MOCK_AI_ANALYSIS[candidate.id] ??
    getDefaultAnalysis(candidate, bestMatchScore)

  const initials = candidate.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground w-fit gap-2"
        asChild
      >
        <Link href="/recuriter/candidates">
          <ArrowLeft size={16} variant="Linear" />
          Back to Candidates
        </Link>
      </Button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4"
      >
        <Avatar className="h-14 w-14 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="font-mono text-2xl font-bold tracking-tight">
            {candidate.name}
          </h1>
          <p className="text-muted-foreground mt-0.5 text-[13px]">
            {candidate.title} &middot; {candidate.location}
          </p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* AI Match Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                  <MagicStar
                    size={16}
                    variant="Bold"
                    className="text-primary"
                  />
                  AI Match Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                  <ScoreRing score={bestMatchScore} />
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground text-[13px] leading-relaxed">
                      {analysis.feedback}
                    </p>
                    {analysis.strengths.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-1.5 text-[12px] font-semibold text-emerald-600">
                          Strengths
                        </p>
                        <ul className="space-y-1.5">
                          {analysis.strengths.map((s, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: 0.5 + i * 0.08,
                                duration: 0.2,
                              }}
                              className="text-muted-foreground flex items-start gap-2 text-[12px]"
                            >
                              <TickCircle
                                size={13}
                                variant="Bold"
                                className="mt-0.5 shrink-0 text-emerald-500"
                              />
                              {s}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysis.gaps.length > 0 && (
                      <div className="mt-3">
                        <p className="mb-1.5 text-[12px] font-semibold text-amber-600">
                          Gaps &amp; Suggestions
                        </p>
                        <ul className="space-y-1.5">
                          {analysis.gaps.map((g, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay:
                                  0.5 +
                                  analysis.strengths.length * 0.08 +
                                  i * 0.08,
                                duration: 0.2,
                              }}
                              className="text-muted-foreground flex items-start gap-2 text-[12px]"
                            >
                              <Star
                                size={13}
                                variant="Bold"
                                className="mt-0.5 shrink-0 text-amber-500"
                              />
                              {g}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  {candidate.summary}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Experience */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {candidate.workHistory.map((job, i) => (
                  <div key={i} className="border-muted relative border-l-2 pl-4">
                    <div className="bg-primary absolute top-1 -left-1.5 h-2.5 w-2.5 rounded-full" />
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-[13px] font-semibold">{job.role}</p>
                      <span className="text-muted-foreground text-[10px]">
                        {job.period}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-2 text-[12px]">
                      {job.company}
                    </p>
                    <ul className="space-y-1">
                      {job.highlights.map((h, j) => (
                        <li
                          key={j}
                          className="text-muted-foreground flex items-start gap-2 text-[11px]"
                        >
                          <span className="bg-muted-foreground/30 mt-1.5 h-1 w-1 shrink-0 rounded-full" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.education.map((edu, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                      <Book
                        size={15}
                        variant="Bold"
                        className="text-muted-foreground"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold">{edu.degree}</p>
                      <p className="text-muted-foreground text-[12px]">
                        {edu.institution}
                      </p>
                      <p className="text-muted-foreground/60 text-[11px]">
                        {edu.years}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, i) => {
                    const isMatch = allJobSkills.has(skill.toLowerCase())
                    return (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04, duration: 0.2 }}
                      >
                        <Badge
                          variant={isMatch ? 'default' : 'secondary'}
                          className={cn(
                            'gap-1 px-2.5 py-1 text-[12px] font-medium',
                            isMatch &&
                              'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15'
                          )}
                        >
                          {isMatch && (
                            <TickCircle
                              size={11}
                              variant="Bold"
                              className="text-emerald-500"
                            />
                          )}
                          {skill}
                        </Badge>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-x-6">
                  <InfoRow icon={Sms} label="Email" value={candidate.email} />
                  <InfoRow icon={Call} label="Phone" value={candidate.phone} />
                  <InfoRow
                    icon={Location}
                    label="Location"
                    value={candidate.location}
                  />
                  <InfoRow
                    icon={Briefcase}
                    label="Experience"
                    value={candidate.experience}
                  />
                  <InfoRow
                    icon={Flag}
                    label="Nationality"
                    value={candidate.nationality}
                  />
                  {candidate.linkedinUrl && (
                    <InfoRow
                      icon={LinkIcon}
                      label="LinkedIn"
                      value={
                        <span className="text-primary">
                          {candidate.linkedinUrl}
                        </span>
                      }
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Applications */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  Applications
                  <span className="text-muted-foreground ml-2 text-[12px] font-normal">
                    ({applications.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {applications.length === 0 ? (
                  <p className="text-muted-foreground py-4 text-center text-[12px]">
                    No applications yet
                  </p>
                ) : (
                  applications.map((app) => {
                    const statusConfig = APPLICATION_STATUS_CONFIG[app.status]
                    const score = app.relevanceScore
                    return (
                      <div
                        key={app.id}
                        className="rounded-lg border p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] font-semibold">
                            {app.jobTitle}
                          </p>
                          {score !== null && (
                            <span
                              className={cn(
                                'text-[11px] font-bold tabular-nums shrink-0',
                                Math.round(score * 100) >= 80
                                  ? 'text-emerald-500'
                                  : Math.round(score * 100) >= 65
                                    ? 'text-amber-500'
                                    : 'text-rose-500'
                              )}
                            >
                              {Math.round(score * 100)}%
                            </span>
                          )}
                        </div>
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
                            {new Date(app.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full gap-2 rounded-lg text-[13px]">
                  <Send size={14} variant="Linear" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-lg text-[13px]"
                >
                  <Calendar size={14} variant="Linear" />
                  Schedule Interview
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-lg text-[13px]"
                >
                  <People size={14} variant="Linear" />
                  Add to Talent Pool
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
