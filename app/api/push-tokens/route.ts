import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken, extractBearerToken } from '@/lib/auth-mobile'

// POST - Register a push token
export async function POST(request: NextRequest) {
  try {
    const token = extractBearerToken(request)
    if (!token) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 })
    }

    const payload = await verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { pushToken, platform } = await request.json()

    if (!pushToken || !platform) {
      return NextResponse.json({ error: 'pushToken and platform are required' }, { status: 400 })
    }

    if (platform !== 'ios' && platform !== 'android') {
      return NextResponse.json({ error: 'platform must be "ios" or "android"' }, { status: 400 })
    }

    // Upsert: if token already exists for another user, reassign it
    await prisma.pushToken.upsert({
      where: { token: pushToken },
      update: { userId: payload.sub, platform },
      create: { userId: payload.sub, token: pushToken, platform },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Push token registration error:', error)
    return NextResponse.json({ error: 'Failed to register push token' }, { status: 500 })
  }
}

// DELETE - Unregister a push token
export async function DELETE(request: NextRequest) {
  try {
    const token = extractBearerToken(request)
    if (!token) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 })
    }

    const payload = await verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { pushToken } = await request.json()

    if (!pushToken) {
      return NextResponse.json({ error: 'pushToken is required' }, { status: 400 })
    }

    await prisma.pushToken.deleteMany({
      where: { token: pushToken, userId: payload.sub },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Push token unregistration error:', error)
    return NextResponse.json({ error: 'Failed to unregister push token' }, { status: 500 })
  }
}
