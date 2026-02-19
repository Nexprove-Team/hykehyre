'use server'

import { eq, and, desc, isNull, inArray } from 'drizzle-orm'
import { db, jobs, applications, candidateProfiles, user } from '@hackhyre/db'
import { getSession } from '@/lib/auth-session'

export type ApplicationStatus =
  | 'not_reviewed'
  | 'under_review'
  | 'interviewing'
  | 'rejected'
  | 'hired'

export interface RecruiterApplicationListItem {
  id: string
  candidateId: string | null
  candidateName: string
  candidateEmail: string
  jobTitle: string
  status: ApplicationStatus
  relevanceScore: number | null
  createdAt: Date
}

export async function getRecruiterApplications(): Promise<
  RecruiterApplicationListItem[]
> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const recruiterId = session.user.id

  // 1. Fetch recruiter's non-deleted jobs
  const recruiterJobs = await db
    .select({ id: jobs.id, title: jobs.title })
    .from(jobs)
    .where(and(eq(jobs.recruiterId, recruiterId), isNull(jobs.deletedAt)))

  if (recruiterJobs.length === 0) return []

  const jobIds = recruiterJobs.map((j) => j.id)
  const jobTitleMap = new Map(recruiterJobs.map((j) => [j.id, j.title]))

  // 2. Fetch all applications for those jobs
  const allApps = await db
    .select()
    .from(applications)
    .where(inArray(applications.jobId, jobIds))
    .orderBy(desc(applications.createdAt))

  if (allApps.length === 0) return []

  // 3. Batch-fetch user names for registered candidates
  const registeredIds = [
    ...new Set(
      allApps
        .map((a) => a.candidateId)
        .filter((id): id is string => id !== null)
    ),
  ]

  const userMap = new Map<string, string>()

  if (registeredIds.length > 0) {
    const users = await db
      .select({ id: user.id, name: user.name })
      .from(user)
      .where(inArray(user.id, registeredIds))

    for (const u of users) {
      userMap.set(u.id, u.name)
    }
  }

  // 4. Build flat application list
  return allApps.map((app) => ({
    id: app.id,
    candidateId: app.candidateId,
    candidateName:
      (app.candidateId ? userMap.get(app.candidateId) : null) ??
      app.candidateName,
    candidateEmail: app.candidateEmail,
    jobTitle: jobTitleMap.get(app.jobId) ?? 'Unknown Job',
    status: app.status as ApplicationStatus,
    relevanceScore: app.relevanceScore,
    createdAt: app.createdAt,
  }))
}
