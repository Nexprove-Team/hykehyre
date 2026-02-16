import { useQuery } from '@tanstack/react-query'
import {
  getPublicJobs,
  getFeaturedJobs,
  getTopCompanies,
} from '@/actions/jobs'
import type { JobFilters } from '@/actions/jobs'

export const jobKeys = {
  all: ['jobs'] as const,
  list: (filters: JobFilters) => [...jobKeys.all, 'list', filters] as const,
  featured: () => [...jobKeys.all, 'featured'] as const,
  topCompanies: () => [...jobKeys.all, 'top-companies'] as const,
}

export function usePublicJobs(filters: JobFilters) {
  return useQuery({
    queryKey: jobKeys.list(filters),
    queryFn: () => getPublicJobs(filters),
  })
}

export function useFeaturedJobs() {
  return useQuery({
    queryKey: jobKeys.featured(),
    queryFn: () => getFeaturedJobs(),
  })
}

export function useTopCompanies() {
  return useQuery({
    queryKey: jobKeys.topCompanies(),
    queryFn: () => getTopCompanies(),
  })
}
