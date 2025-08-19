/**
 * SETUP GUIDE (3 steps)
 * STEP 1: Ensure AUTH_SECRET is set in .env.local
 * STEP 2: Configure NEXTAUTH_URL for your domain
 * STEP 3: Verify admin user has ADMIN role in database
 * NOTE: Protects /admin routes and API endpoints
 * TODO: Add rate limiting for API routes
 */

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // BEGINNER: Set AUTH_SECRET="your-super-secret-key" in .env.local
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isApiAdminRoute = req.nextUrl.pathname.startsWith('/api/admin')

    // Protect admin routes - require ADMIN role
    if ((isAdminRoute || isApiAdminRoute) && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/api/auth/signin', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (!req.nextUrl.pathname.startsWith('/admin')) {
          return true
        }

        // Require authentication for admin routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}