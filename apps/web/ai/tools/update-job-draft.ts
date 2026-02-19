import { tool } from 'ai'
import { z } from 'zod'

export function createUpdateJobDraftTool() {
  return tool({
    description:
      'Update the live job preview panel with the information collected so far. Call this after each piece of information is confirmed by the recruiter (e.g. after they confirm the title, after they provide the employment type, etc.). Include ALL fields collected so far, not just the new one. The client uses this to render a real-time preview.',
    inputSchema: z.object({
      title: z.string().optional().describe('Job title'),
      description: z.string().optional().describe('Job description'),
      employmentType: z
        .enum(['full_time', 'part_time', 'contract', 'internship'])
        .optional()
        .describe('Employment type'),
      experienceLevel: z
        .enum(['entry', 'mid', 'senior', 'lead', 'executive'])
        .optional()
        .describe('Experience level'),
      location: z.string().optional().describe('Office location'),
      isRemote: z.boolean().optional().describe('Whether remote-friendly'),
      salaryMin: z.number().optional().describe('Minimum salary'),
      salaryMax: z.number().optional().describe('Maximum salary'),
      salaryCurrency: z.string().optional().describe('Salary currency'),
      requirements: z.array(z.string()).optional().describe('Requirements'),
      responsibilities: z
        .array(z.string())
        .optional()
        .describe('Responsibilities'),
      skills: z.array(z.string()).optional().describe('Skills'),
    }),
    execute: async (input) => {
      return { updated: true, draft: input }
    },
  })
}
