'use client'

import { cn } from '@hackhyre/ui/lib/utils'
import { Star, TrendUp } from '@hackhyre/ui/icons'
import { FeaturedJobCard } from './job-card'
import { useJobListingFilter } from './use-job-listing-filter'
import { useSavedJobs } from './use-saved-jobs'
import { MOCK_JOBS, TOP_RECRUITERS } from './mock-data'

// ── Apple Logo (small, for recruiter list) ─────────────────────────────

function AppleLogoSmall() {
  return (
    <svg
      width="10"
      height="12"
      viewBox="0 0 14 17"
      fill="currentColor"
      className="text-white"
    >
      <path d="M13.2 12.8c-.3.7-.7 1.3-1.1 1.8-.6.8-1.1 1.3-1.5 1.6-.6.5-1.3.7-2 .7-.5 0-1.1-.1-1.8-.4-.7-.3-1.3-.4-1.8-.4s-1.1.1-1.8.4c-.7.3-1.2.4-1.7.4-.7 0-1.4-.3-2-.8C.9 15.5.4 14.8 0 13.8c-.1-.4.1-.7.4-.9.3-.1.7 0 .8.3.3.8.7 1.4 1.2 1.8.4.3.8.5 1.2.5.3 0 .8-.1 1.4-.4.6-.3 1.2-.4 1.7-.4.5 0 1 .1 1.7.4.6.3 1.1.4 1.4.4.4 0 .9-.2 1.3-.5.4-.4.8-.9 1.1-1.6.2-.4.4-.9.5-1.3.1-.3-.1-.6-.3-.8-.8-.4-1.4-.9-1.8-1.6-.5-.7-.7-1.5-.7-2.4 0-1 .3-1.9.9-2.6.5-.5 1-.9 1.7-1.2.2-.1.5 0 .7.2.1.2.1.5-.1.6-.5.2-.9.5-1.3.9-.4.5-.6 1.2-.6 1.9 0 .8.2 1.4.6 2 .4.6.9 1 1.5 1.3.2.1.3.4.3.6 0 .1 0 .2-.1.3-.2.5-.3 1-.6 1.5z" />
      <path d="M10.1 0c.1.7-.2 1.5-.7 2.2-.6.8-1.3 1.3-2.1 1.2-.1-.7.2-1.4.7-2.1C8.6.5 9.3.1 10.1 0z" />
    </svg>
  )
}

// ── Featured Sidebar ───────────────────────────────────────────────────

export function FeaturedSidebar() {
  const [filters, setFilters] = useJobListingFilter()
  const toggle = useSavedJobs((s) => s.toggle)
  const saved = useSavedJobs((s) => s.saved)

  const featuredJobs = MOCK_JOBS.filter((job) => job.featured).map((job) => ({
    ...job,
    saved: saved[job.id] ?? job.saved,
  }))

  const activeRecruiter = filters.recruiter || null

  const handleRecruiterClick = (name: string) => {
    setFilters({ recruiter: activeRecruiter === name ? '' : name })
  }

  return (
    <aside className="hidden w-70 shrink-0 space-y-6 xl:block">
      {/* Featured Jobs */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Star size={16} variant="Bold" className="text-amber-500" />
          <h3 className="text-sm font-semibold text-neutral-900">Featured Jobs</h3>
        </div>
        <div className="space-y-2.5">
          {featuredJobs.map((job) => (
            <FeaturedJobCard key={job.id} job={job} onToggleSave={toggle} />
          ))}
        </div>
      </div>

      {/* Top Recruiters */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <TrendUp size={16} variant="Bold" className="text-primary" />
          <h3 className="text-sm font-semibold text-neutral-900">Top Recruiters</h3>
        </div>
        <div className="space-y-1.5">
          {TOP_RECRUITERS.map((recruiter) => (
            <button
              key={recruiter.id}
              onClick={() => handleRecruiterClick(recruiter.name)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                activeRecruiter === recruiter.name
                  ? 'bg-primary/5 ring-primary/20 ring-1'
                  : 'hover:bg-neutral-50'
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white',
                  recruiter.logoColor
                )}
              >
                {recruiter.name === 'Apple' ? (
                  <AppleLogoSmall />
                ) : (
                  <span className="text-[11px] font-bold">{recruiter.logoLetter}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-neutral-900">
                  {recruiter.name}
                </p>
                <p className="text-[11px] text-neutral-500">
                  {recruiter.jobCount} open positions
                </p>
              </div>
              {activeRecruiter === recruiter.name && (
                <span className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
