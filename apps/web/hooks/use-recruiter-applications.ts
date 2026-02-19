import { useQuery } from '@tanstack/react-query'
import { getRecruiterApplications } from '@/actions/recruiter-applications'

export const recruiterApplicationKeys = {
  all: ['recruiter-applications'] as const,
  list: () => [...recruiterApplicationKeys.all, 'list'] as const,
}

export function useRecruiterApplications() {
  return useQuery({
    queryKey: recruiterApplicationKeys.list(),
    queryFn: () => getRecruiterApplications(),
  })
}
