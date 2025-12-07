import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuth = !!req.auth

  // Protect client portal routes (except login page)
  if (pathname.startsWith('/client-portal') && pathname !== '/client-portal/login') {
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
