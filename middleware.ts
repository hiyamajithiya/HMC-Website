import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuth = !!req.auth

  // Public client portal routes (no auth required)
  const publicClientPortalRoutes = [
    '/client-portal/login',
    '/client-portal/forgot-password',
    '/client-portal/reset-password'
  ]

  // Protect client portal routes (except public pages)
  if (pathname.startsWith('/client-portal') && !publicClientPortalRoutes.includes(pathname)) {
    if (!isAuth) {
      const loginUrl = new URL('/client-portal/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/client-portal/:path*'],
}
