import { auth } from '@hackhyre/db/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/onboarding',
  '/messages',
  '/applications',
  '/recuriter',
  '/profile',
  '/saved-jobs',
  '/settings',
]
const authRoutes = ['/sign-in', '/sign-up']
const onboardingPath = '/onboarding'

// Routes restricted by role
const candidateOnlyRoutes = [
  '/dashboard',
  '/messages',
  '/applications',
  '/profile',
  '/saved-jobs',
  '/settings',
]
const recruiterOnlyRoutes = ['/recuriter']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )
  const isAuthRoute = authRoutes.some((route) => pathname === route)
  const isOnboarding = pathname === onboardingPath

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (session && !isOnboarding && isProtected && !session.user.onboardingCompleted) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  // Role-based access control
  if (session && isProtected) {
    const role = (session.user as { role?: string }).role ?? 'candidate'

    const isCandidateRoute = candidateOnlyRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
    )
    const isRecruiterRoute = recruiterOnlyRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
    )

    // Redirect recruiters away from candidate routes
    if (role === 'recruiter' && isCandidateRoute) {
      return NextResponse.redirect(new URL('/recuriter/dashboard', request.url))
    }

    // Redirect candidates away from recruiter routes
    if (role === 'candidate' && isRecruiterRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding',
    '/messages/:path*',
    '/applications/:path*',
    '/recuriter/:path*',
    '/profile/:path*',
    '/saved-jobs/:path*',
    '/settings/:path*',
    '/sign-in',
    '/sign-up',
  ],
}
