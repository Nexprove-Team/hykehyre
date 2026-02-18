'use server'

import { eq, and, desc, isNull, inArray, count } from 'drizzle-orm'
import { db, jobs, applications } from '@hackhyre/db'
import { getSession } from '@/lib/auth-session'

export interface RecruiterJobListItem {
  id: string
  title: string
  status: string
  employmentType: string
  experienceLevel: string
  location: string | null
  isRemote: boolean
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  applicationCount: number
  createdAt: Date
}

export async function getRecruiterJobs(): Promise<RecruiterJobListItem[]> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const recruiterId = session.user.id

  // 1. Fetch all non-deleted jobs for this recruiter
  const allJobs = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.recruiterId, recruiterId), isNull(jobs.deletedAt)))
    .orderBy(desc(jobs.createdAt))

  if (allJobs.length === 0) return []

  // 2. Count applications per job
  const jobIds = allJobs.map((j) => j.id)
  const appCounts = await db
    .select({
      jobId: applications.jobId,
      count: count(),
    })
    .from(applications)
    .where(inArray(applications.jobId, jobIds))
    .groupBy(applications.jobId)

  const countMap = new Map(appCounts.map((r) => [r.jobId, r.count]))

  // 3. Merge and return
  return allJobs.map((j) => ({
    id: j.id,
    title: j.title,
    status: j.status,
    employmentType: j.employmentType,
    experienceLevel: j.experienceLevel,
    location: j.location,
    isRemote: j.isRemote,
    salaryMin: j.salaryMin,
    salaryMax: j.salaryMax,
    salaryCurrency: j.salaryCurrency,
    applicationCount: countMap.get(j.id) ?? 0,
    createdAt: j.createdAt,
  }))
}
