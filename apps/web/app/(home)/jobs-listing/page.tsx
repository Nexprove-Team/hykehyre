'use client'

import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@hackhyre/ui/components/button'
import { Badge } from '@hackhyre/ui/components/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hackhyre/ui/components/select'
import { Filter } from '@hackhyre/ui/icons'
import { useDebounce } from 'use-debounce'

import SearchFilter from './(components)/search-filter'
import { FiltersSidebar } from './(components)/filters-sidebar'
import { FeaturedSidebar } from './(components)/featured-sidebar'
import { JobCard } from './(components)/job-card'
import { useJobListingFilter } from './(components)/use-job-listing-filter'
import { useSavedJobs } from './(components)/use-saved-jobs'
import { MOCK_JOBS, EXPERIENCE_MAP } from './(components)/mock-data'

// ── Main Page ──────────────────────────────────────────────────────────

const PAGE_SIZE = 6

export default function JobsPage() {
  const [filters] = useJobListingFilter()
  const toggleSave = useSavedJobs((s) => s.toggle)
  const saved = useSavedJobs((s) => s.saved)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Debounce the search query by 300ms
  const [debouncedQuery] = useDebounce(filters.q, 300)

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [debouncedQuery, filters])

  // ── Filter jobs ────────────────────────────────────────────────────

  const filteredJobs = useMemo(() => {
    const query = debouncedQuery.toLowerCase().trim()
    const salaryMin = filters.salary[0] ?? 0
    const salaryMax = filters.salary[1] ?? 20000

    return MOCK_JOBS.filter((job) => {
      // Text search (debounced)
      if (query) {
        const searchable =
          `${job.title} ${job.company} ${job.tags.join(' ')}`.toLowerCase()
        if (!searchable.includes(query)) return false
      }

      // Recruiter filter (right sidebar)
      if (filters.recruiter && job.company !== filters.recruiter) return false

      // Location filter
      if (filters.location && filters.location !== 'any') {
        if (job.locationType !== filters.location) return false
      }

      // Experience filter
      if (filters.experience && filters.experience !== 'any') {
        const validLabels = EXPERIENCE_MAP[filters.experience]
        if (validLabels && !job.tags.some((t) => validLabels.includes(t)))
          return false
      }

      // Salary range filter
      if (job.salaryHourly < salaryMin || job.salaryHourly > salaryMax)
        return false

      // Working schedule filter (show jobs that match ANY active schedule)
      if (filters.schedule.length > 0) {
        const hasMatch = job.workingSchedule.some((s) =>
          filters.schedule.includes(s)
        )
        if (!hasMatch) return false
      }

      // Employment type filter (show jobs that match ANY active type)
      if (filters.employment.length > 0) {
        const hasMatch = job.employmentType.some((t) =>
          filters.employment.includes(t)
        )
        if (!hasMatch) return false
      }

      return true
    })
  }, [debouncedQuery, filters])

  // Add save state to jobs
  const jobsWithSaveState = filteredJobs.map((job) => ({
    ...job,
    saved: saved[job.id] ?? job.saved,
  }))

  const visibleJobs = jobsWithSaveState.slice(0, visibleCount)
  const hasMore = visibleCount < jobsWithSaveState.length

  // Intersection observer for infinite scroll
  const loadMore = useCallback(() => {
    setVisibleCount((prev) =>
      Math.min(prev + PAGE_SIZE, jobsWithSaveState.length)
    )
  }, [jobsWithSaveState.length])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  return (
    <div className="bg-white text-neutral-900">
      <SearchFilter />

      <div className="mx-auto mt-6 flex max-w-360 gap-6 px-4 pb-12 sm:px-6 lg:px-8">
        <div className="hidden lg:block">
          <FiltersSidebar />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-mono text-xl font-bold">Recommended jobs</h2>
              <Badge
                variant="outline"
                className="rounded-lg border-neutral-200 bg-white px-2.5 py-1 text-[12px] font-semibold text-neutral-900"
              >
                {jobsWithSaveState.length}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden text-[13px] text-neutral-500 sm:inline">
                Sort by:
              </span>
              <Select defaultValue="updated">
                <SelectTrigger className="h-8 w-auto gap-1.5 border-0 bg-white px-2 text-[13px] font-semibold text-neutral-900 shadow-none focus-visible:ring-0 dark:bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-neutral-200 bg-white">
                  <SelectItem
                    value="updated"
                    className="text-neutral-700 focus:bg-neutral-100 focus:text-neutral-900"
                  >
                    Last updated
                  </SelectItem>
                  <SelectItem
                    value="salary-high"
                    className="text-neutral-700 focus:bg-neutral-100 focus:text-neutral-900"
                  >
                    Salary: High to Low
                  </SelectItem>
                  <SelectItem
                    value="salary-low"
                    className="text-neutral-700 focus:bg-neutral-100 focus:text-neutral-900"
                  >
                    Salary: Low to High
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-neutral-400"
              >
                <Filter size={16} variant="Linear" />
              </Button>
            </div>
          </div>

          {visibleJobs.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {visibleJobs.map((job) => (
                <JobCard key={job.id} job={job} onToggleSave={toggleSave} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
              <p className="text-lg font-semibold text-neutral-400">
                No jobs found
              </p>
              <p className="mt-1 text-sm text-neutral-400">
                Try adjusting your filters or search query
              </p>
            </div>
          )}

          {/* Infinite scroll sentinel */}
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-8">
              <span className="text-sm text-neutral-400">Loading more...</span>
            </div>
          )}
        </div>

        {/* Right — Featured Jobs + Top Recruiters (self-contained) */}
        <FeaturedSidebar />
      </div>
    </div>
  )
}
