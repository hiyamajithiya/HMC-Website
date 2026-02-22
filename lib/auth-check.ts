import { auth } from '@/auth'
import { headers } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth-mobile'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuthSession = any

type AuthCheckResult =
  | { error: string; status: number }
  | { session: AuthSession }

type AuthCheckResultWithRole =
  | { error: string; status: number }
  | { session: AuthSession; role: string }

/**
 * Get session from either mobile Bearer token or NextAuth cookie.
 * Mobile requests send Authorization: Bearer <jwt>.
 * Web requests use NextAuth session cookies.
 */
export async function getSession(): Promise<AuthSession | null> {
  // Check for mobile Bearer token first
  const headersList = await headers()
  const authHeader = headersList.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const payload = await verifyAccessToken(token)
    if (payload) {
      return {
        user: {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          role: payload.role,
        },
      }
    }
    // Invalid Bearer token — don't fall through to cookie auth
    return null
  }

  // Fall back to NextAuth session (web)
  return auth()
}

/**
 * Check if current user is an ADMIN
 */
export async function checkAdmin(): Promise<AuthCheckResult> {
  const session = await getSession()
  if (!session?.user?.email) {
    return { error: 'Unauthorized', status: 401 }
  }

  if ((session.user as any).role !== 'ADMIN') {
    return { error: 'Forbidden', status: 403 }
  }

  return { session }
}

/**
 * Check if current user is ADMIN or STAFF
 */
export async function checkAdminOrStaff(): Promise<AuthCheckResultWithRole> {
  const session = await getSession()
  if (!session?.user?.email) {
    return { error: 'Unauthorized', status: 401 }
  }

  const role = (session.user as any).role
  if (role !== 'ADMIN' && role !== 'STAFF') {
    return { error: 'Forbidden', status: 403 }
  }

  return { session, role }
}

/**
 * Check if current user is authenticated (any role).
 * Used for routes that any logged-in user can access.
 */
export async function checkAuth(): Promise<AuthCheckResult> {
  const session = await getSession()
  if (!session?.user?.email) {
    return { error: 'Unauthorized', status: 401 }
  }

  return { session }
}
