'use client'

import Link from 'next/link'
import { Button } from '@hackhyre/ui/components/button'
import { Checkbox } from '@hackhyre/ui/components/checkbox'
import { ArrowLeft } from '@hackhyre/ui/icons'
import { useJobListingFilter } from './use-job-listing-filter'
import {
  WORKING_SCHEDULE_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
} from './mock-data'

// ── Promo Card ─────────────────────────────────────────────────────────

function PromoCard() {
  return (
    <div className="bg-brand-charcoal relative overflow-hidden rounded-2xl p-6 text-white">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
        viewBox="0 0 300 350"
        fill="none"
      >
        <circle cx="150" cy="50" r="120" stroke="white" strokeWidth="0.5" />
        <circle cx="150" cy="50" r="160" stroke="white" strokeWidth="0.5" />
        <circle cx="150" cy="50" r="200" stroke="white" strokeWidth="0.5" />
        <circle cx="150" cy="50" r="240" stroke="white" strokeWidth="0.5" />
        <line x1="0" y1="180" x2="300" y2="120" stroke="white" strokeWidth="0.5" />
        <line x1="0" y1="220" x2="300" y2="160" stroke="white" strokeWidth="0.5" />
      </svg>

      <div className="bg-primary/20 mb-5 h-20 w-20 rounded-2xl" />

      <h3 className="mb-1 font-mono text-xl leading-tight font-bold">
        Get Your best profession with{' '}
        <span className="text-primary">HackHyre</span>
      </h3>

      <Button className="mt-4 rounded-full font-semibold" size="default" asChild>
        <Link href="/sign-up">Learn more</Link>
      </Button>
    </div>
  )
}

// ── Checkbox Group (forced light mode) ─────────────────────────────────

function FilterCheckboxGroup({
  title,
  options,
  activeValues,
  onToggle,
}: {
  title: string
  options: { label: string }[]
  activeValues: string[]
  onToggle: (label: string, checked: boolean) => void
}) {
  return (
    <div className="mb-5">
      <p className="mb-3 text-[13px] font-medium text-neutral-500">{title}</p>
      <div className="space-y-2.5">
        {options.map((option) => (
          <label
            key={option.label}
            className="flex cursor-pointer items-center gap-2.5"
          >
            <Checkbox
              className="border-neutral-300 bg-white shadow-none data-[state=checked]:border-primary data-[state=checked]:bg-primary dark:border-neutral-300 dark:bg-white dark:data-[state=checked]:border-primary dark:data-[state=checked]:bg-primary"
              checked={activeValues.includes(option.label)}
              onCheckedChange={(checked) => onToggle(option.label, !!checked)}
            />
            <span className="text-[13px] text-neutral-700 dark:text-neutral-700">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

// ── Sidebar ────────────────────────────────────────────────────────────

export function FiltersSidebar() {
  const [filters, setFilters] = useJobListingFilter()

  const toggleSchedule = (label: string, checked: boolean) => {
    const next = checked
      ? [...filters.schedule, label]
      : filters.schedule.filter((s) => s !== label)
    setFilters({ schedule: next })
  }

  const toggleEmployment = (label: string, checked: boolean) => {
    const next = checked
      ? [...filters.employment, label]
      : filters.employment.filter((e) => e !== label)
    setFilters({ employment: next })
  }

  return (
    <aside className="w-full shrink-0 space-y-6 lg:w-65">
      <PromoCard />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-900">
            Filters
          </h3>
          <button className="text-neutral-400 transition-colors hover:text-neutral-900">
            <ArrowLeft size={18} variant="Linear" />
          </button>
        </div>

        <FilterCheckboxGroup
          title="Working schedule"
          options={WORKING_SCHEDULE_OPTIONS}
          activeValues={filters.schedule}
          onToggle={toggleSchedule}
        />

        <FilterCheckboxGroup
          title="Employment type"
          options={EMPLOYMENT_TYPE_OPTIONS}
          activeValues={filters.employment}
          onToggle={toggleEmployment}
        />
      </div>
    </aside>
  )
}
