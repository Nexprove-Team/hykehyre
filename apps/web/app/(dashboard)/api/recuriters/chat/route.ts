import { streamText, stepCountIs, convertToModelMessages } from 'ai'
import { google } from '@ai-sdk/google'
import { eq, asc } from 'drizzle-orm'
import { getSession } from '@/lib/auth-session'
import { buildJobCreationSystemPrompt } from '@/ai/agents/job-creation-agent'
import { createGetRecruiterCompaniesTool } from '@/ai/tools/get-recruiter-company'
import { createSaveJobTool } from '@/ai/tools/save-job'
import { createParseJobDescriptionTool } from '@/ai/tools/parse-job-description'
import { createMarkJobCreationCompleteTool } from '@/ai/tools/mark-job-creation-complete'
import { createCreateCompanyTool } from '@/ai/tools/create-company'
import { createUpdateJobDraftTool } from '@/ai/tools/update-job-draft'
import { db, companies } from '@hackhyre/db'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages } = await req.json()
  const userId = session.user.id
  const userName = session.user.name

  const userCompanies = await db
    .select({
      id: companies.id,
      name: companies.name,
      website: companies.website,
      logoUrl: companies.logoUrl,
    })
    .from(companies)
    .where(eq(companies.createdBy, userId))
    .orderBy(asc(companies.createdAt))

  const message = await convertToModelMessages(messages)

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: buildJobCreationSystemPrompt(userName, userCompanies),
    messages: message,
    tools: {
      getRecruiterCompanies: createGetRecruiterCompaniesTool(userId),
      createCompany: createCreateCompanyTool(userId),
      saveJob: createSaveJobTool(userId),
      parseJobDescription: createParseJobDescriptionTool(),
      updateJobDraft: createUpdateJobDraftTool(),
      markJobCreationComplete: createMarkJobCreationCompleteTool(),
    },
    stopWhen: stepCountIs(10),
  })

  return result.toUIMessageStreamResponse()
}
