import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST - Verify OTP and allow download
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { leadId, otp } = body

    // Validate required fields
    if (!leadId || !otp) {
      return NextResponse.json(
        { error: 'Lead ID and OTP are required' },
        { status: 400 }
      )
    }

    // Find the download lead
    const lead = await prisma.articleLead.findUnique({
      where: { id: leadId },
      include: {
        tool: {
          select: {
            id: true,
            name: true,
            downloadUrl: true,
            slug: true,
          },
        },
      },
    })

    if (!lead || !lead.tool) {
      return NextResponse.json(
        { error: 'Download request not found' },
        { status: 404 }
      )
    }

    // Helper to normalize download URL to API format
    const normalizeDownloadUrl = (url: string | null): string | null => {
      if (!url) return null
      // Already in correct API format
      if (url.startsWith('/api/download/')) return url
      // Old format: /downloads/filename
      if (url.startsWith('/downloads/')) {
        return `/api/download/${url.replace('/downloads/', '')}`
      }
      // Just filename - prepend API path
      if (!url.startsWith('/') && !url.startsWith('http')) {
        return `/api/download/${url}`
      }
      // Return as-is for external URLs
      return url
    }

    // Check if already verified
    if (lead.verified) {
      // Return download URL directly
      const downloadUrl = normalizeDownloadUrl(lead.tool!.downloadUrl)

      return NextResponse.json({
        success: true,
        message: 'Already verified',
        downloadUrl,
        toolName: lead.tool!.name,
      })
    }

    // Check if OTP is expired
    if (!lead.otpExpiry || new Date() > lead.otpExpiry) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (lead.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      )
    }

    // Mark as verified and update download time
    await prisma.articleLead.update({
      where: { id: leadId },
      data: {
        verified: true,
        downloadedAt: new Date(),
        otp: null, // Clear OTP after verification
        otpExpiry: null,
      },
    })

    // Increment download count for the tool
    await prisma.tool.update({
      where: { id: lead.tool.id },
      data: {
        downloadCount: { increment: 1 },
      },
    })

    // Construct download URL using the same normalizer
    const downloadUrl = normalizeDownloadUrl(lead.tool.downloadUrl)

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      downloadUrl,
      toolName: lead.tool.name,
    })
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}
