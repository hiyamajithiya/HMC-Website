import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP, sendDownloadOTP } from '@/lib/email'

export const dynamic = 'force-dynamic'

// POST - Request download and send OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, toolId } = body

    // Validate required fields
    if (!name || !email || !toolId) {
      return NextResponse.json(
        { error: 'Name, email, and tool ID are required' },
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

    // Check if tool exists
    const tool = await prisma.tool.findUnique({
      where: { id: toolId },
      select: { id: true, name: true, isActive: true },
    })

    if (!tool || !tool.isActive) {
      return NextResponse.json(
        { error: 'Tool not found or inactive' },
        { status: 404 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Check if there's an existing lead for this email and tool
    const existingLead = await prisma.downloadLead.findFirst({
      where: {
        email: email.toLowerCase(),
        toolId: toolId,
      },
      orderBy: { createdAt: 'desc' },
    })

    let leadId: string

    if (existingLead) {
      // Update existing lead with new OTP
      const updatedLead = await prisma.downloadLead.update({
        where: { id: existingLead.id },
        data: {
          name,
          phone: phone || null,
          company: company || null,
          otp,
          otpExpiry,
          verified: false,
        },
      })
      leadId = updatedLead.id
    } else {
      // Create new download lead
      const newLead = await prisma.downloadLead.create({
        data: {
          name,
          email: email.toLowerCase(),
          phone: phone || null,
          company: company || null,
          toolId,
          otp,
          otpExpiry,
        },
      })
      leadId = newLead.id
    }

    // Send OTP email
    try {
      await sendDownloadOTP({
        name,
        email: email.toLowerCase(),
        toolName: tool.name,
        otp,
      })
    } catch (emailError: any) {
      console.error('Failed to send OTP email:', emailError)
      // Provide more specific error message
      let errorMessage = 'Failed to send OTP email. '
      if (emailError.message?.includes('SMTP settings not configured')) {
        errorMessage += 'SMTP is not configured. Please configure email settings in admin panel or set SMTP environment variables.'
      } else if (emailError.message?.includes('Invalid login') || emailError.message?.includes('auth')) {
        errorMessage += 'SMTP authentication failed. Please check your email credentials.'
      } else if (emailError.message?.includes('ENCRYPTION_KEY')) {
        errorMessage += 'Encryption key issue. Please check ENCRYPTION_KEY environment variable.'
      } else {
        errorMessage += emailError.message || 'Please try again.'
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
      leadId,
    })
  } catch (error) {
    console.error('Download request error:', error)
    return NextResponse.json(
      { error: 'Failed to process download request' },
      { status: 500 }
    )
  }
}
