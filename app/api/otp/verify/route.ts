import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 verify attempts per minute per IP
    const ip = getClientIp(request)
    const rateLimit = checkRateLimit(`otp-verify:${ip}`, { max: 10, windowSeconds: 60 })
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, otp, purpose } = body

    // Validate required fields
    if (!email || !otp || !purpose) {
      return NextResponse.json(
        { error: 'Email, OTP, and purpose are required' },
        { status: 400 }
      )
    }

    // Find the latest verification record
    const verification = await prisma.emailVerification.findFirst({
      where: {
        email: email.toLowerCase(),
        purpose,
        verified: false,
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!verification) {
      return NextResponse.json(
        { error: 'No pending verification found. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Check if OTP is expired
    if (new Date() > verification.otpExpiry) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (verification.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      )
    }

    // Mark as verified
    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { verified: true },
    })

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Email verified successfully',
    })
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}
