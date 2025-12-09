import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// Helper to check admin status
async function checkAdmin() {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: 'Unauthorized', status: 401 }
  }

  const isAdmin = session.user.email === 'info@himanshumajithiya.com' ||
                  session.user.email === 'admin@himanshumajithiya.com'

  if (!isAdmin) {
    return { error: 'Forbidden', status: 403 }
  }

  return { session }
}

// GET all users
export async function GET() {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
