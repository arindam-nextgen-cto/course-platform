import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/cohorts',
    '/profile',
    '/settings',
    '/courses/[id]/enroll', // Course enrollment pages
  ]
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/courses',
    '/about',
    '/pricing',
    '/terms',
    '/privacy',
    '/contact',
  ]

  // Auth routes
  const authRoutes = ['/auth/signin', '/auth/signup']

  const isProtectedRoute = protectedRoutes.some(route => {
    if (route.includes('[id]')) {
      // Handle dynamic routes like /courses/[id]/enroll
      const pattern = route.replace('[id]', '[^/]+')
      const regex = new RegExp(`^${pattern}`)
      return regex.test(req.nextUrl.pathname)
    }
    return req.nextUrl.pathname.startsWith(route)
  })

  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route)
  )

  // Redirect to sign in if accessing protected route without session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/signin', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname + req.nextUrl.search)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if accessing auth pages with active session
  if (isAuthRoute && session) {
    const redirectTo = req.nextUrl.searchParams.get('redirectTo') || '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, req.url))
  }

  // For courses page, allow both authenticated and unauthenticated users
  // but provide different experiences
  if (req.nextUrl.pathname.startsWith('/courses') && !req.nextUrl.pathname.includes('/enroll')) {
    // Add session info to headers for the courses page to conditionally render content
    if (session) {
      res.headers.set('x-user-authenticated', 'true')
      res.headers.set('x-user-id', session.user.id)
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
}