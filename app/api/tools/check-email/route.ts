import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// POST - Check if email is verified for any tool
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 20 checks per minute per IP
    const ip = getClientIp(request)
    const rateLimit = checkRateLimit(`check-email:${ip}`, { max: 20, windowSeconds: 60 })
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if this email has any verified download
    const verifiedLead = await prisma.articleLead.findFirst({
      where: {
        email: email.toLowerCase(),
        verified: true,
      },
      select: {
        name: true,
        phone: true,
        company: true,
      },
      orderBy: {
        createdAt: 'desc', // Get the most recent record
      },
    })

    if (verifiedLead) {
      return NextResponse.json({
        recognized: true,
        name: verifiedLead.name,
        phone: verifiedLead.phone,
        company: verifiedLead.company,
      })
    }

    return NextResponse.json({
      recognized: false,
    })
  } catch (error) {
    console.error('Check email error:', error)
    return NextResponse.json(
      { error: 'Failed to check email' },
      { status: 500 }
    )
  }
}
