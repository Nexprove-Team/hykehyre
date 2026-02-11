'use client'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@hackhyre/ui/components/select'
import { Slider } from '@hackhyre/ui/components/slider'
import { Button } from '@hackhyre/ui/components/button'
import {
  Briefcase,
  DollarCircle,
  Location,
  SearchNormal,
  CloseCircle,
} from '@hackhyre/ui/icons'
import { useJobListingFilter } from './use-job-listing-filter'

// Default values to compare against
const DEFAULTS = {
  q: '',
  role: '',
  location: 'any',
  experience: '',
  period: 'monthly',
  salary: [0, 20000],
  schedule: ['Full time', 'Part time'],
  employment: ['Full day', 'Flexible schedule', 'Distant work'],
  recruiter: '',
}

function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return true
  const sorted1 = [...a].sort()
  const sorted2 = [...b].sort()
  return sorted1.some((v, i) => v !== sorted2[i])
}

const SearchFilter = () => {
  const [filters, setFilters] = useJobListingFilter()

  const hasActiveFilters =
    filters.q !== DEFAULTS.q ||
    (filters.location !== '' && filters.location !== DEFAULTS.location) ||
    filters.experience !== DEFAULTS.experience ||
    filters.period !== DEFAULTS.period ||
    filters.salary[0] !== DEFAULTS.salary[0] ||
    filters.salary[1] !== DEFAULTS.salary[1] ||
    filters.recruiter !== DEFAULTS.recruiter ||
    arraysEqual(filters.schedule, DEFAULTS.schedule) ||
    arraysEqual(filters.employment, DEFAULTS.employment)

  const resetAll = () =>
    setFilters({
      q: '',
      role: '',
      location: 'any',
      experience: '',
      period: 'monthly',
      salary: [0, 20000],
      schedule: ['Full time', 'Part time'],
      employment: ['Full day', 'Flexible schedule', 'Distant work'],
      recruiter: '',
    })

  return (
    <div className="bg-black p-4 dark:bg-black">
      <div className="mx-auto grid max-w-375 grid-cols-1 divide-y divide-neutral-800 sm:grid-cols-2 sm:divide-x md:flex md:items-center md:divide-y-0">
        <div className="flex min-w-0 flex-1 items-center gap-2 px-4 py-3 sm:col-span-2 md:py-2">
          <SearchNormal
            size={18}
            variant="Linear"
            className="shrink-0 text-neutral-500"
          />
          <input
            type="text"
            value={filters.q}
            onChange={(e) => setFilters({ q: e.target.value })}
            placeholder="Search jobs..."
            className="h-auto w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-neutral-500"
          />
        </div>

        <div className="flex items-center gap-2 px-4 py-3 md:border-l md:border-neutral-800 md:py-2">
          <Location
            size={18}
            variant="Linear"
            className="shrink-0 text-neutral-500"
          />
          <Select
            value={filters.location || 'any'}
            onValueChange={(v) => setFilters({ location: v })}
          >
            <SelectTrigger className="h-auto w-32 border-0 p-0 text-sm font-medium text-white shadow-none ring-0 focus:ring-0 focus-visible:ring-0">
              <SelectValue placeholder="Work location" />
            </SelectTrigger>
            <SelectContent className="border-neutral-800 bg-neutral-900">
              <SelectItem
                value="any"
                className="text-neutral-300 focus:bg-neutral-800 focus:text-white"
              >
                Work location
              </SelectItem>
              <SelectItem
                value="remote"
                className="text-neutral-300 focus:bg-neutral-800 focus:text-white"
              >
                Remote
              </SelectItem>
              <SelectItem
                value="onsite"
                className="text-neutral-300 focus:bg-neutral-800 focus:text-white"
              >
                On-site
              </SelectItem>
              <SelectItem
                value="hybrid"
                className="text-neutral-300 focus:bg-neutral-800 focus:text-white"
              >
                Hybrid
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 md:border-l md:border-neutral-800 md:py-2">
          <Briefcase
            size={18}
            variant="Linear"
            className="shrink-0 text-neutral-500"
          />
          <Select
            value={filters.experience || 'any'}
            onValueChange={(v) => setFilters({ experience: v })}
          >
            <SelectTrigger className="h-auto w-28 border-0 p-0 text-sm font-medium text-white shadow-none ring-0 focus:ring-0 focus-visible:ring-0">
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent className="border-neutral-800 bg-neutral-900">
              <SelectItem
                value="any"
                className="text-neutral-300 focus:bg-neutral-800 focus:text-white"
              >
                Experience
              </SelectItem>
              <SelectItem
                value="entry"
                className="text-neutral-300 focus:bg-neutral-800 focus:text-white"
              >
                Entry level
              </SelectItem>
              <SelectItem
                value="mid"
                className="text-neutral-300 focus:bg-neutral-800 focus:text-white"
              >
                Mid level
              </SelectItem>
              <SelectItem
                value="senior"
                className="text-neutral-300 focus:bg-neutral-800 focus:text-white"
              >
                Senior level
              </SelectItem>
              <SelectItem
                value="lead"
                className="text-neutral-300 focus:bg-neutral-800 focus:text-white"
              >
                Lead
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 md:border-l md:border-neutral-800 md:py-2">
          <DollarCircle
            size={18}
            variant="Linear"
            className="shrink-0 text-neutral-500"
          />
          <Select
            value={filters.period || 'monthly'}
            onValueChange={(v) => setFilters({ period: v })}
          >
            <SelectTrigger className="h-auto w-24 border-0 p-0 text-sm font-medium text-white shadow-none ring-0 focus:ring-0 focus-visible:ring-0">
              <SelectValue placeholder="Per month" />
            </SelectTrigger>
            <SelectContent className="border-neutral-800 bg-neutral-900">
              <SelectItem
                value="monthly"
                className="text-neutral-300 focus:bg-neutral-800 focus:text-white"
              >
                Per month
              </SelectItem>
              <SelectItem
                value="hourly"
                className="text-neutral-300 focus:bg-neutral-800 focus:text-white"
              >
                Per hour
              </SelectItem>
              <SelectItem
                value="yearly"
                className="text-neutral-300 focus:bg-neutral-800 focus:text-white"
              >
                Per year
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4 px-4 py-3 sm:col-span-2 md:ml-auto md:border-l md:border-neutral-800 md:py-2">
          <div className="text-right">
            <p className="text-[11px] font-medium text-neutral-500">
              Salary range
            </p>
            <p className="text-sm font-semibold text-white">
              ${filters.salary[0]?.toLocaleString()} – $
              {filters.salary[1]?.toLocaleString()}
            </p>
          </div>
          <Slider
            defaultValue={filters.salary}
            min={0}
            max={20000}
            step={100}
            onValueChange={(v) => setFilters({ salary: v })}
            className="w-45"
          />
        </div>

        {hasActiveFilters && (
          <div className="flex items-center px-4 py-3 md:border-l md:border-neutral-800 md:py-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto gap-1.5 px-2 py-1 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
              onClick={resetAll}
            >
              <CloseCircle size={14} variant="Linear" />
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchFilter
