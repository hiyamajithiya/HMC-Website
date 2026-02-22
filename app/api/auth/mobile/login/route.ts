import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import {
  signAccessToken,
  signRefreshToken,
  storeRefreshToken,
  generateTokenFamily,
  type MobileTokenPayload,
} from '@/lib/auth-mobile'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rateLimit = checkRateLimit(`mobile-login:${ip}`, { max: 10, windowSeconds: 60 })
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const { identifier, password, selectedUserId } = await request.json()

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Please enter your login ID/email and password' },
        { status: 400 }
      )
    }

    // Helper to issue tokens for a validated user
    async function issueTokens(user: { id: string; email: string | null; name: string | null; role: string }) {
      // Only ADMIN and CLIENT can use the mobile app (no STAFF)
      if (user.role === 'STAFF') {
        return NextResponse.json(
          { error: 'Staff accounts cannot access the mobile app' },
          { status: 403 }
        )
      }

      const payload: MobileTokenPayload = {
        sub: user.id,
        email: user.email || '',
        name: user.name || '',
        role: user.role,
      }

      const [accessToken, refreshToken] = await Promise.all([
        signAccessToken(payload),
        signRefreshToken(payload),
      ])

      const family = generateTokenFamily()
      await storeRefreshToken(user.id, refreshToken, family)

      return NextResponse.json({
        token: accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      })
    }

    // If a specific user is selected (multi-account flow)
    if (selectedUserId) {
      const user = await prisma.user.findUnique({
        where: { id: selectedUserId },
      })

      if (!user) {
        return NextResponse.json({ error: 'Selected user not found' }, { status: 400 })
      }
      if (!user.isActive) {
        return NextResponse.json({ error: 'Your account has been deactivated' }, { status: 400 })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
      }

      return issueTokens(user)
    }

    const isEmail = identifier.includes('@')

    if (isEmail) {
      const usersWithEmail = await prisma.user.findMany({
        where: { email: identifier },
      })

      if (usersWithEmail.length === 0) {
        return NextResponse.json({ error: 'No user found with this email' }, { status: 400 })
      }

      if (usersWithEmail.length === 1) {
        const user = usersWithEmail[0]
        if (!user.isActive) {
          return NextResponse.json({ error: 'Your account has been deactivated' }, { status: 400 })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
        }

        return issueTokens(user)
      }

      // Multiple users with same email - account selection
      const validUsers = []
      for (const user of usersWithEmail) {
        if (user.isActive) {
          const isPasswordValid = await bcrypt.compare(password, user.password)
          if (isPasswordValid) {
            validUsers.push({
              id: user.id,
              name: user.name,
              loginId: user.loginId,
              role: user.role,
            })
          }
        }
      }

      if (validUsers.length === 0) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
      }

      // Filter out STAFF accounts from multi-account selection
      const mobileUsers = validUsers.filter(u => u.role !== 'STAFF')
      if (mobileUsers.length === 0) {
        return NextResponse.json(
          { error: 'No accounts eligible for mobile access' },
          { status: 403 }
        )
      }

      return NextResponse.json({
        multiAccount: true,
        accounts: mobileUsers,
      })
    } else {
      // Login with loginId
      const user = await prisma.user.findUnique({
        where: { loginId: identifier },
      })

      if (!user) {
        return NextResponse.json({ error: 'No user found with this login ID' }, { status: 400 })
      }
      if (!user.isActive) {
        return NextResponse.json({ error: 'Your account has been deactivated' }, { status: 400 })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
      }

      return issueTokens(user)
    }
  } catch (error) {
    console.error('Mobile login error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
