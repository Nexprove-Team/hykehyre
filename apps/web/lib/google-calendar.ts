import { google } from 'googleapis'
import { eq } from 'drizzle-orm'
import { db, googleOauthTokens } from '@hackhyre/db'
import { env } from '@/env/server'

// ── OAuth2 Client ────────────────────────────────────────────────────

export function createOAuth2Client() {
  return new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
  )
}

export function getAuthorizationUrl(recruiterId: string) {
  const client = createOAuth2Client()
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    state: recruiterId,
  })
}

export async function exchangeCodeForTokens(code: string) {
  const client = createOAuth2Client()
  const { tokens } = await client.getToken(code)
  return tokens
}

// ── Authorized Client ────────────────────────────────────────────────

export async function getAuthorizedClient(recruiterId: string) {
  const [row] = await db
    .select()
    .from(googleOauthTokens)
    .where(eq(googleOauthTokens.userId, recruiterId))

  if (!row) return null

  const client = createOAuth2Client()
  client.setCredentials({
    access_token: row.accessToken,
    refresh_token: row.refreshToken,
    token_type: row.tokenType,
    expiry_date: row.expiresAt.getTime(),
  })

  // Auto-refresh: persist new access token when refreshed
  client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      await db
        .update(googleOauthTokens)
        .set({
          accessToken: tokens.access_token,
          expiresAt: tokens.expiry_date
            ? new Date(tokens.expiry_date)
            : new Date(Date.now() + 3600 * 1000),
          updatedAt: new Date(),
        })
        .where(eq(googleOauthTokens.userId, recruiterId))
    }
  })

  return client
}

// ── Calendar Operations ──────────────────────────────────────────────

interface CreateEventParams {
  recruiterId: string
  summary: string
  description?: string
  startTime: Date
  durationMinutes: number
  attendees: { email: string }[]
}

export async function createCalendarEventWithMeet(
  params: CreateEventParams
): Promise<{ meetLink: string; eventId: string } | null> {
  const client = await getAuthorizedClient(params.recruiterId)
  if (!client) return null

  const calendar = google.calendar({ version: 'v3', auth: client })
  const endTime = new Date(
    params.startTime.getTime() + params.durationMinutes * 60 * 1000
  )

  const event = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary: params.summary,
      description: params.description,
      start: { dateTime: params.startTime.toISOString() },
      end: { dateTime: endTime.toISOString() },
      attendees: params.attendees,
      conferenceData: {
        createRequest: {
          requestId: `hackhyre-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    },
  })

  const meetLink = event.data.hangoutLink ?? null
  const eventId = event.data.id ?? null

  if (!meetLink || !eventId) return null
  return { meetLink, eventId }
}

export async function deleteCalendarEvent(
  recruiterId: string,
  eventId: string
) {
  const client = await getAuthorizedClient(recruiterId)
  if (!client) return

  const calendar = google.calendar({ version: 'v3', auth: client })
  await calendar.events.delete({
    calendarId: 'primary',
    eventId,
  })
}

export async function updateCalendarEvent(
  recruiterId: string,
  eventId: string,
  updates: { startTime?: Date; durationMinutes?: number }
) {
  const client = await getAuthorizedClient(recruiterId)
  if (!client) return

  const calendar = google.calendar({ version: 'v3', auth: client })

  const patch: Record<string, unknown> = {}
  if (updates.startTime) {
    patch.start = { dateTime: updates.startTime.toISOString() }
    const endTime = new Date(
      updates.startTime.getTime() +
        (updates.durationMinutes ?? 30) * 60 * 1000
    )
    patch.end = { dateTime: endTime.toISOString() }
  }

  await calendar.events.patch({
    calendarId: 'primary',
    eventId,
    requestBody: patch,
  })
}
