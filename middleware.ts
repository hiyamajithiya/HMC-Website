import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

// Use the Edge-compatible auth config for middleware
export default NextAuth(authConfig).auth

export const config = {
  matcher: ['/client-portal/:path*'],
}
