import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST - Verify OTP and allow article download
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { leadId, otp } = body

    if (!leadId || !otp) {
      return NextResponse.json({ error: 'Lead ID and OTP are required' }, { status: 400 })
    }

    const lead = await prisma.articleLead.findUnique({
      where: { id: leadId },
      include: {
        article: { select: { id: true, title: true, filePath: true } },
      },
    })

    if (!lead || !lead.article) {
      return NextResponse.json({ error: 'Download request not found' }, { status: 404 })
    }

    // Already verified
    if (lead.verified) {
      return NextResponse.json({
        success: true,
        message: 'Already verified',
        downloadUrl: lead.article.filePath,
        resourceName: lead.article.title,
      })
    }

    // Check OTP expiry
    if (!lead.otpExpiry || new Date() > lead.otpExpiry) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 })
    }

    // Verify OTP
    if (lead.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 })
    }

    // Mark as verified
    await prisma.articleLead.update({
      where: { id: leadId },
      data: { verified: true, downloadedAt: new Date(), otp: null, otpExpiry: null },
    })

    // Increment download count
    await prisma.article.update({
      where: { id: lead.article.id },
      data: { downloadCount: { increment: 1 } },
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      downloadUrl: lead.article.filePath,
      resourceName: lead.article.title,
    })
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 })
  }
}
