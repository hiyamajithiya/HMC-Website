import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST - Register a push token for the authenticated user
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { token, platform } = await request.json()
    if (!token || !platform) {
      return NextResponse.json({ error: 'token and platform are required' }, { status: 400 })
    }

    // Upsert: if this token exists for another user, reassign it; if it's new, create it
    await prisma.pushToken.upsert({
      where: { token },
      update: { userId: session.user.id, platform },
      create: { token, platform, userId: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to register push token:', error)
    return NextResponse.json({ error: 'Failed to register push token' }, { status: 500 })
  }
}

// DELETE - Remove a push token on logout
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { token } = await request.json()
    if (!token) {
      return NextResponse.json({ error: 'token is required' }, { status: 400 })
    }

    await prisma.pushToken.deleteMany({
      where: { token, userId: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to remove push token:', error)
    return NextResponse.json({ error: 'Failed to remove push token' }, { status: 500 })
  }
}
