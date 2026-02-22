import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  rotateRefreshToken,
  type MobileTokenPayload,
} from '@/lib/auth-mobile'

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 400 })
    }

    // Verify the refresh token JWT
    const payload = await verifyRefreshToken(refreshToken)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 })
    }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    })

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Account not found or deactivated' }, { status: 401 })
    }

    // Staff cannot use mobile app
    if (user.role === 'STAFF') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Build fresh payload (role may have changed)
    const newPayload: MobileTokenPayload = {
      sub: user.id,
      email: user.email || '',
      name: user.name || '',
      role: user.role,
    }

    const [newAccessToken, newRefreshToken] = await Promise.all([
      signAccessToken(newPayload),
      signRefreshToken(newPayload),
    ])

    // Rotate: invalidate old refresh token, store new one
    const rotation = await rotateRefreshToken(refreshToken, newRefreshToken, user.id)
    if (!rotation) {
      // Possible token reuse attack - all tokens in family revoked
      return NextResponse.json(
        { error: 'Token reuse detected. Please log in again.' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      token: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
