import { useQuery } from '@tanstack/react-query'
import {
  getRecruiterJobs,
  getRecruiterJobDetail,
} from '@/actions/recruiter-jobs'

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

export function useRecruiterJobDetail(jobId: string) {
  return useQuery({
    queryKey: [...recruiterJobKeys.all, 'detail', jobId],
    queryFn: () => getRecruiterJobDetail(jobId),
  })
}
