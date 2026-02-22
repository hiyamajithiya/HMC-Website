import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET current user's profile
export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        services: true,
        createdAt: true,
        _count: {
          select: {
            documents: true,
            appointments: true,
          }
        }
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get upcoming appointments count
    const upcomingAppointments = await prisma.appointment.count({
      where: {
        userId: user.id,
        date: {
          gte: new Date()
        },
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    })

    return NextResponse.json({
      ...user,
      upcomingAppointments
    })
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}
