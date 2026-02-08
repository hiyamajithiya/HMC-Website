import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP, sendVerificationOTP } from '@/lib/email'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 OTP requests per minute per IP
    const ip = getClientIp(request)
    const rateLimit = checkRateLimit(`otp:${ip}`, { max: 5, windowSeconds: 60 })
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, name, purpose } = body

    // Validate required fields
    if (!email || !name || !purpose) {
      return NextResponse.json(
        { error: 'Email, name, and purpose are required' },
        { status: 400 }
      )
    }

    // Validate purpose
    if (purpose !== 'contact' && purpose !== 'appointment') {
      return NextResponse.json(
        { error: 'Invalid purpose' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Clean up old unverified records for same email+purpose
    await prisma.emailVerification.deleteMany({
      where: {
        email: email.toLowerCase(),
        purpose,
        verified: false,
      },
    })

    // Generate OTP and store
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.emailVerification.create({
      data: {
        email: email.toLowerCase(),
        otp,
        otpExpiry,
        purpose,
      },
    })

    // Send OTP email
    try {
      await sendVerificationOTP({
        name,
        email: email.toLowerCase(),
        otp,
        purpose,
      })
    } catch (emailError: any) {
      console.error('Failed to send verification OTP:', emailError)
      let errorMessage = 'Failed to send OTP email. '
      if (emailError.message?.includes('SMTP settings not configured')) {
        errorMessage += 'Email service is not configured.'
      } else {
        errorMessage += 'Please try again.'
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
    })
  } catch (error) {
    console.error('OTP send error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
