import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - Fetch authenticated user's appointments
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const upcoming = searchParams.get('upcoming')

    const whereClause: any = { userId: session.user.id }

    if (status) {
      whereClause.status = status
    }

    if (upcoming === 'true') {
      whereClause.date = { gte: new Date() }
      whereClause.status = { in: ['PENDING', 'CONFIRMED'] }
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Failed to fetch user appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}
