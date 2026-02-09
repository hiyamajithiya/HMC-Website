import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier } = body

    if (!identifier) {
      return NextResponse.json(
        { error: 'Email or Login ID is required' },
        { status: 400 }
      )
    }

    // Find user by email or loginId
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { loginId: identifier }
        ],
        isActive: true
      }
    })

    // Always return success to prevent email enumeration
    if (!user || !user.email) {
      // If no user found or user has no email, still return success
      // This prevents attackers from knowing which emails/loginIds exist
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email/login ID, you will receive a password reset link.'
      })
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Delete any existing tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { identifier: user.email }
    })

    // Create new token
    await prisma.passwordResetToken.create({
      data: {
        identifier: user.email,
        token,
        expires
      }
    })

    // Build reset URL
    const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/client-portal/reset-password?token=${token}`

    // Send email
    await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetUrl
    })

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email/login ID, you will receive a password reset link.'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}
