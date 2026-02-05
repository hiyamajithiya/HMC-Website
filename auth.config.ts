import type { NextAuthConfig } from 'next-auth'

// Edge-compatible auth configuration (no Prisma, no bcrypt)
// This is used by middleware which runs on Edge Runtime
export const authConfig: NextAuthConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: 'authjs.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: 'authjs.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: 'authjs.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/client-portal/login',
    error: '/client-portal/login',
  },
  providers: [], // Providers added in auth.ts (requires Node.js)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    // Authorize callback for middleware - runs on Edge
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const pathname = nextUrl.pathname

      // Public client portal routes
      const publicRoutes = [
        '/client-portal/login',
        '/client-portal/forgot-password',
        '/client-portal/reset-password'
      ]

      // Check if accessing protected client portal routes
      if (pathname.startsWith('/client-portal') && !publicRoutes.includes(pathname)) {
        return isLoggedIn // Redirect to login if not authenticated
      }

      return true // Allow access to other routes
    },
  },
}
