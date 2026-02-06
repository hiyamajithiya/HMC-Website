import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST - Check if email is verified for any tool
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if this email has any verified download
    const verifiedLead = await prisma.downloadLead.findFirst({
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
