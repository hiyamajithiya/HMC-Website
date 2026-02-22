import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken, extractBearerToken, revokeAllUserTokens } from '@/lib/auth-mobile'

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

    // Revoke all refresh tokens for this user
    await revokeAllUserTokens(payload.sub)

    // Remove push token if provided
    const body = await request.json().catch(() => ({}))
    if (body.pushToken) {
      await prisma.pushToken.deleteMany({
        where: { token: body.pushToken, userId: payload.sub },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Mobile logout error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
