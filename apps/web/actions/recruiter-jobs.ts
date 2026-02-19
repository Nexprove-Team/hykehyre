'use server'

import { eq, and, desc, isNull, inArray, count } from 'drizzle-orm'
import { db, jobs, applications, companies } from '@hackhyre/db'
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

export interface RecruiterJobDetail {
  id: string
  title: string
  description: string
  status: string
  employmentType: string
  experienceLevel: string
  location: string | null
  isRemote: boolean
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  requirements: string[]
  responsibilities: string[]
  skills: string[]
  applicationCount: number
  createdAt: Date
  company: {
    id: string
    name: string
    website: string | null
    logoUrl: string | null
  } | null
  applications: {
    id: string
    candidateId: string | null
    candidateName: string
    candidateEmail: string
    status: string
    relevanceScore: number | null
    createdAt: Date
  }[]
}

export async function getRecruiterJobDetail(
  jobId: string
): Promise<RecruiterJobDetail | null> {
  const session = await getSession()
  if (!session) return null

  const recruiterId = session.user.id

  // 1. Fetch the job
  const [job] = await db
    .select()
    .from(jobs)
    .where(
      and(
        eq(jobs.id, jobId),
        eq(jobs.recruiterId, recruiterId),
        isNull(jobs.deletedAt)
      )
    )
    .limit(1)

  if (!job) return null

  // 2. Fetch company if linked
  let company: RecruiterJobDetail['company'] = null
  if (job.companyId) {
    const [c] = await db
      .select({
        id: companies.id,
        name: companies.name,
        website: companies.website,
        logoUrl: companies.logoUrl,
      })
      .from(companies)
      .where(eq(companies.id, job.companyId))
      .limit(1)
    if (c) company = c
  }

  // 3. Fetch applications
  const jobApplications = await db
    .select({
      id: applications.id,
      candidateId: applications.candidateId,
      candidateName: applications.candidateName,
      candidateEmail: applications.candidateEmail,
      status: applications.status,
      relevanceScore: applications.relevanceScore,
      createdAt: applications.createdAt,
    })
    .from(applications)
    .where(eq(applications.jobId, jobId))
    .orderBy(desc(applications.createdAt))

  return {
    id: job.id,
    title: job.title,
    description: job.description,
    status: job.status,
    employmentType: job.employmentType,
    experienceLevel: job.experienceLevel,
    location: job.location,
    isRemote: job.isRemote,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: job.salaryCurrency,
    requirements: job.requirements ?? [],
    responsibilities: job.responsibilities ?? [],
    skills: job.skills ?? [],
    applicationCount: jobApplications.length,
    createdAt: job.createdAt,
    company,
    applications: jobApplications,
  }
}
