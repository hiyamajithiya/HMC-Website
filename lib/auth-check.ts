import { auth } from '@/auth'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuthSession = any

type AuthCheckResult =
  | { error: string; status: number }
  | { session: AuthSession }

type AuthCheckResultWithRole =
  | { error: string; status: number }
  | { session: AuthSession; role: string }

/**
 * Check if current user is an ADMIN
 */
export async function checkAdmin(): Promise<AuthCheckResult> {
  const session = await auth()
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
  const session = await auth()
  if (!session?.user?.email) {
    return { error: 'Unauthorized', status: 401 }
  }

  const role = (session.user as any).role
  if (role !== 'ADMIN' && role !== 'STAFF') {
    return { error: 'Forbidden', status: 403 }
  }

  return { session, role }
}
