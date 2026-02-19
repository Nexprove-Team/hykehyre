'use client'

import Link from 'next/link'
import { Sheet, SheetContent, SheetTitle } from '@hackhyre/ui/components/sheet'
import { Badge } from '@hackhyre/ui/components/badge'
import { Button } from '@hackhyre/ui/components/button'
import { Separator } from '@hackhyre/ui/components/separator'
import { Skeleton } from '@hackhyre/ui/components/skeleton'
import {
  Location,
  Global,
  Calendar,
  People,
  Briefcase,
  ArrowRight,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { useCompanySheet } from './use-company-sheet'
import { toDisplayJob } from './mock-data'
import { useCompanyJobs, useCompanyProfile } from '@/hooks/use-jobs'

// ── Light mode CSS variable overrides ─────────────────────────────────

const LIGHT_VARS: React.CSSProperties = {
  '--background': 'oklch(0.985 0 0)',
  '--foreground': 'oklch(0.145 0.005 285)',
  '--card': 'oklch(1 0 0)',
  '--card-foreground': 'oklch(0.145 0.005 285)',
  '--popover': 'oklch(1 0 0)',
  '--popover-foreground': 'oklch(0.145 0.005 285)',
  '--secondary': 'oklch(0.955 0.003 260)',
  '--secondary-foreground': 'oklch(0.205 0.005 260)',
  '--muted': 'oklch(0.955 0.003 260)',
  '--muted-foreground': 'oklch(0.52 0.01 260)',
  '--accent': 'oklch(0.955 0.04 155)',
  '--accent-foreground': 'oklch(0.145 0.005 285)',
  '--border': 'oklch(0.92 0.005 260)',
  '--input': 'oklch(0.92 0.005 260)',
  colorScheme: 'light',
} as React.CSSProperties

// ── Logo color palette (deterministic from name) ──────────────────────

const LOGO_COLORS = [
  'bg-blue-500',
  'bg-rose-500',
  'bg-indigo-600',
  'bg-green-600',
  'bg-violet-600',
  'bg-sky-500',
  'bg-pink-500',
  'bg-amber-600',
  'bg-teal-600',
  'bg-red-600',
  'bg-zinc-800',
  'bg-purple-700',
]

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getLogoColor(name: string) {
  return LOGO_COLORS[hashString(name) % LOGO_COLORS.length]!
}

// ── Info Row ──────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Location
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <Icon size={14} variant="Linear" className="shrink-0 text-neutral-400" />
      <span className="w-24 shrink-0 text-[12px] text-neutral-500">
        {label}
      </span>
      <span className="text-[12px] font-medium text-neutral-900">{value}</span>
    </div>
  )
}

// ── Sheet ─────────────────────────────────────────────────────────────

const SHEET_CLASSES =
  'w-full sm:w-[480px] sm:max-w-[480px] p-0 flex flex-col inset-0 sm:inset-y-3 sm:right-3 sm:left-auto h-dvh sm:h-[calc(100dvh-1.5rem)] rounded-none sm:rounded-2xl border-0 sm:border bg-white text-neutral-900'

export function CompanySheet() {
  const { isOpen, companyName, close } = useCompanySheet()

  const { data: company, isLoading } = useCompanyProfile(companyName ?? '')
  const { data: rawJobs } = useCompanyJobs(companyName ?? '')
  const companyJobs = (rawJobs ?? []).map((item, i) => toDisplayJob(item, i))

  if (isLoading) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
        <SheetContent
          side="right"
          className={SHEET_CLASSES}
          style={LIGHT_VARS}
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Company Profile</SheetTitle>
          <div className="space-y-4 p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-16 w-16 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  if (!company) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
        <SheetContent
          side="right"
          className={SHEET_CLASSES}
          style={LIGHT_VARS}
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Company Profile</SheetTitle>
          <div className="flex h-full items-center justify-center">
            <p className="text-[13px] text-neutral-500">Company not found</p>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  const logoColor = getLogoColor(company.name)
  const logoLetter = company.name.charAt(0).toUpperCase()
  const displayWebsite = company.website
    ? company.website.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : null

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent
        side="right"
        className={SHEET_CLASSES}
        style={LIGHT_VARS}
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">
          {company.name} Company Profile
        </SheetTitle>

        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-0">
          <h3 className="text-[13px] font-semibold text-neutral-900">
            Company Profile
          </h3>
          <button
            onClick={close}
            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="border-b border-neutral-200 px-6 pt-4 pb-5">
            <div className="flex items-start gap-4">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                />
              ) : (
                <div
                  className={cn(
                    'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white',
                    logoColor
                  )}
                >
                  <span className="text-xl font-bold">{logoLetter}</span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-[18px] font-bold text-neutral-900">
                  {company.name}
                </h2>
                <div className="mt-1 flex items-center gap-2 text-[12px] text-neutral-500">
                  <Briefcase size={12} variant="Linear" />
                  {company.jobCount} open{' '}
                  {company.jobCount === 1 ? 'position' : 'positions'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              {company.website ? (
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 flex-1 gap-2 rounded-lg text-[12px] font-semibold text-neutral-900"
                  asChild
                >
                  <a
                    href={
                      company.website.startsWith('http')
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Global size={14} variant="Linear" />
                    Visit Website
                  </a>
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 flex-1 gap-2 rounded-lg text-[12px] font-semibold text-neutral-900"
                  disabled
                >
                  <Global size={14} variant="Linear" />
                  No Website
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 rounded-lg border-neutral-200 bg-white text-[12px] text-neutral-700 hover:bg-neutral-50"
              >
                <People size={14} variant="Linear" />
                Follow
              </Button>
            </div>
          </div>

          <div className="space-y-0 px-6 py-5">
            {/* About */}
            {company.description && (
              <>
                <div>
                  <h4 className="mb-2 text-[12px] font-semibold tracking-wider text-neutral-500 uppercase">
                    About
                  </h4>
                  <p className="text-[12px] leading-relaxed text-neutral-600">
                    {company.description}
                  </p>
                </div>
                <Separator className="my-5 bg-neutral-200" />
              </>
            )}

            {/* Company Info */}
            <div>
              <h4 className="mb-2 text-[12px] font-semibold tracking-wider text-neutral-500 uppercase">
                Company Info
              </h4>
              <div className="space-y-0.5">
                <InfoRow
                  icon={Calendar}
                  label="Joined"
                  value={company.createdAt.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                />
                <InfoRow
                  icon={People}
                  label="Open Jobs"
                  value={String(company.jobCount)}
                />
                {displayWebsite && (
                  <InfoRow
                    icon={Global}
                    label="Website"
                    value={displayWebsite}
                  />
                )}
              </div>
            </div>

            <Separator className="my-5 bg-neutral-200" />

            {/* Open Positions */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-[12px] font-semibold tracking-wider text-neutral-500 uppercase">
                  Open Positions
                </h4>
                <Badge
                  variant="outline"
                  className="border-neutral-200 bg-neutral-50 px-2 py-0 text-[10px] font-semibold text-neutral-600"
                >
                  {companyJobs.length}
                </Badge>
              </div>

              {companyJobs.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <Briefcase
                    size={28}
                    variant="Linear"
                    className="mb-2 text-neutral-300"
                  />
                  <p className="text-[12px] text-neutral-500">
                    No open positions right now
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {companyJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/jobs-listing/${job.id}`}
                      onClick={close}
                      className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 transition-colors hover:bg-neutral-50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-neutral-900">
                          {job.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Location size={10} variant="Linear" />
                            {job.location}
                          </span>
                          <span>&middot;</span>
                          <span>{job.salary}</span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {job.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-neutral-100 px-2 py-0.5 text-[9px] font-medium text-neutral-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight
                        size={14}
                        variant="Linear"
                        className="shrink-0 text-neutral-400"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
