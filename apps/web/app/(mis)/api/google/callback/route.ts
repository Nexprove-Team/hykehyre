import { NextResponse, type NextRequest } from 'next/server'
import { db, googleOauthTokens } from '@hackhyre/db'
import { getSession } from '@/lib/auth-session'
import { exchangeCodeForTokens } from '@/lib/google-calendar'

function popupResponse(status: 'connected' | 'error') {
  const html = `<!DOCTYPE html><html><body><script>
    if (window.opener) {
      window.opener.postMessage({ type: 'google-oauth', status: '${status}' }, '*');
      window.close();
    } else {
      window.location.href = '/recuriter/settings?google=${status}';
    }
  </script><p>Redirecting...</p></body></html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const code = request.nextUrl.searchParams.get('code')
  if (!code) {
    return popupResponse('error')
  }

  try {
    const tokens = await exchangeCodeForTokens(code)

    await db
      .insert(googleOauthTokens)
      .values({
        userId: session.user.id,
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token!,
        tokenType: tokens.token_type ?? 'Bearer',
        expiresAt: new Date(tokens.expiry_date ?? Date.now() + 3600 * 1000),
        scope: tokens.scope ?? 'https://www.googleapis.com/auth/calendar.events',
      })
      .onConflictDoUpdate({
        target: googleOauthTokens.userId,
        set: {
          accessToken: tokens.access_token!,
          refreshToken: tokens.refresh_token!,
          tokenType: tokens.token_type ?? 'Bearer',
          expiresAt: new Date(tokens.expiry_date ?? Date.now() + 3600 * 1000),
          scope:
            tokens.scope ??
            'https://www.googleapis.com/auth/calendar.events',
          updatedAt: new Date(),
        },
      })

    return popupResponse('connected')
  } catch {
    return popupResponse('error')
  }
}
