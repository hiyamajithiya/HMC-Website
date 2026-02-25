import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP, sendDownloadOTP } from '@/lib/email'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// POST - Request resource download and send OTP (or skip if returning user)
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rateLimit = checkRateLimit(`res-download:${ip}`, { max: 10, windowSeconds: 60 })
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, phone, company, downloadId, skipOtp } = body

    if (!name || !email || !downloadId) {
      return NextResponse.json(
        { error: 'Name, email, and download ID are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Check if download resource exists
    const download = await prisma.download.findUnique({
      where: { id: downloadId },
      select: { id: true, title: true, filePath: true, isActive: true },
    })

    if (!download || !download.isActive) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    // Check if this is a returning user (verified for any download/tool)
    const isVerifiedUser = await prisma.downloadLead.findFirst({
      where: { email: email.toLowerCase(), verified: true },
    })

    if (isVerifiedUser && skipOtp) {
      const existingLead = await prisma.downloadLead.findFirst({
        where: { email: email.toLowerCase(), downloadId },
      })

      if (existingLead) {
        await prisma.downloadLead.update({
          where: { id: existingLead.id },
          data: { name, phone: phone || null, company: company || null, verified: true, downloadedAt: new Date(), otp: null, otpExpiry: null },
        })
      } else {
        await prisma.downloadLead.create({
          data: { name, email: email.toLowerCase(), phone: phone || null, company: company || null, downloadId, verified: true, downloadedAt: new Date() },
        })
      }

      await prisma.download.update({
        where: { id: downloadId },
        data: { downloadCount: { increment: 1 } },
      })

      return NextResponse.json({
        success: true,
        skipOtp: true,
        message: 'Welcome back! Download starting...',
        downloadUrl: download.filePath,
        resourceName: download.title,
      })
    }

    // Normal flow: Generate OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    const existingLead = await prisma.downloadLead.findFirst({
      where: { email: email.toLowerCase(), downloadId },
      orderBy: { createdAt: 'desc' },
    })

    let leadId: string

    if (existingLead) {
      const updated = await prisma.downloadLead.update({
        where: { id: existingLead.id },
        data: { name, phone: phone || null, company: company || null, otp, otpExpiry, verified: false },
      })
      leadId = updated.id
    } else {
      const created = await prisma.downloadLead.create({
        data: { name, email: email.toLowerCase(), phone: phone || null, company: company || null, downloadId, otp, otpExpiry },
      })
      leadId = created.id
    }

    try {
      await sendDownloadOTP({ name, email: email.toLowerCase(), toolName: download.title, otp })
    } catch (emailError: any) {
      console.error('Failed to send OTP email:', emailError)
      let errorMessage = 'Failed to send OTP email. '
      if (emailError.message?.includes('SMTP settings not configured')) {
        errorMessage += 'SMTP is not configured.'
      } else if (emailError.message?.includes('Invalid login') || emailError.message?.includes('auth')) {
        errorMessage += 'SMTP authentication failed.'
      } else {
        errorMessage += emailError.message || 'Please try again.'
      }
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'OTP sent to your email', leadId })
  } catch (error) {
    console.error('Download request error:', error)
    return NextResponse.json({ error: 'Failed to process download request' }, { status: 500 })
  }
}
