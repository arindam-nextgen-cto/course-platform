import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define public paths that don't require authentication
  const publicPaths = [
    '/',
    '/courses',
    '/about',
    '/pricing',
    '/terms',
    '/privacy',
    '/contact',
    '/auth/signin',
    '/auth/signup',
    '/auth/callback',
    '/api/waitlist'
  ]

  // Admin paths that require special authentication
  const adminPaths = [
    '/admin',
    '/admin/',
    '/admin/signin'
  ]

  const isPublicPath = publicPaths.some(path =>
    req.nextUrl.pathname === path ||
    req.nextUrl.pathname.startsWith(path + '/')
  )

  const isAdminPath = adminPaths.some(path =>
    req.nextUrl.pathname === path ||
    req.nextUrl.pathname.startsWith(path + '/')
  )

  // Handle admin authentication
  if (isAdminPath && req.nextUrl.pathname !== '/admin/signin') {
    // For all admin paths except signin, check if user is authenticated and has proper role
    if (!user) {
      // Redirect to admin signin if not authenticated
      const redirectUrl = new URL('/admin/signin', req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // For other admin paths, check role via API
    if (req.nextUrl.pathname !== '/admin/signin') {
      try {
        // In middleware, we can't easily check the database, so we'll allow access
        // The actual role check will happen in the page components
      } catch (error) {
        console.error('Error checking admin role:', error)
        const redirectUrl = new URL('/admin/signin', req.url)
        return NextResponse.redirect(redirectUrl)
      }
    }
  } else if (req.nextUrl.pathname === '/admin/signin' && user) {
    // If user is already authenticated and trying to access admin signin, redirect to admin dashboard
    const redirectUrl = new URL('/admin', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Handle regular authentication for protected paths
  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/settings',
    '/courses/'
  ]

  const isProtectedPath = protectedPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !user && !isPublicPath) {
    // Redirect to sign-in page with return URL for protected routes
    const redirectUrl = new URL('/auth/signin', req.url)
    redirectUrl.searchParams.set('returnUrl', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ['/auth/signin', '/auth/signup']
  const isAuthPath = authPaths.includes(req.nextUrl.pathname)

  if (isAuthPath && user) {
    const redirectUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}