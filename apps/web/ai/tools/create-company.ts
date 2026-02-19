import { tool } from 'ai'
import { z } from 'zod'
import { db, companies } from '@hackhyre/db'

export function createCreateCompanyTool(userId: string) {
  return tool({
    description:
      'Create a new company for the recruiter. Call this when the recruiter wants to post a job under a company that does not yet exist in their account. After creating, use the returned companyId when saving the job.',
    inputSchema: z.object({
      name: z.string().describe('Company name'),
      website: z.string().optional().describe('Company website URL'),
      description: z.string().optional().describe('Brief company description'),
    }),
    execute: async (input) => {
      const [row] = await db
        .insert(companies)
        .values({
          name: input.name,
          website: input.website ?? null,
          description: input.description ?? null,
          createdBy: userId,
        })
        .returning({ id: companies.id, name: companies.name })

      return {
        success: true,
        companyId: row!.id,
        companyName: row!.name,
        message: `Company "${input.name}" created successfully.`,
      }
    },
  })
}
