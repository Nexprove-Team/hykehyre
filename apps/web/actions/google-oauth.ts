'use server'

import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db, googleOauthTokens } from '@hackhyre/db'
import { getSession } from '@/lib/auth-session'
import { getAuthorizationUrl } from '@/lib/google-calendar'

export async function connectGoogleCalendar() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const url = getAuthorizationUrl(session.user.id)
  redirect(url)
}

export async function getGoogleAuthUrl(): Promise<string> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  return getAuthorizationUrl(session.user.id)
}

export async function checkGoogleCalendarConnection(): Promise<boolean> {
  const session = await getSession()
  if (!session) return false

  const [row] = await db
    .select({ userId: googleOauthTokens.userId })
    .from(googleOauthTokens)
    .where(eq(googleOauthTokens.userId, session.user.id))

  return !!row
}
