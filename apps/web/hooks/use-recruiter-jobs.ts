import { useQuery } from '@tanstack/react-query'
import { getRecruiterJobs } from '@/actions/recruiter-jobs'

export const recruiterJobKeys = {
  all: ['recruiter-jobs'] as const,
  list: () => [...recruiterJobKeys.all, 'list'] as const,
}

export function useRecruiterJobs() {
  return useQuery({
    queryKey: recruiterJobKeys.list(),
    queryFn: () => getRecruiterJobs(),
  })
}
