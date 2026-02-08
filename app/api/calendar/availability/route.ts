import { NextRequest, NextResponse } from 'next/server'
import { getAvailableSlots } from '@/lib/google-calendar'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Rate limit: 20 availability checks per minute per IP
    const ip = getClientIp(request)
    const rateLimit = checkRateLimit(`calendar:${ip}`, { max: 20, windowSeconds: 60 })
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const date = request.nextUrl.searchParams.get('date')

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required (YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Don't allow past dates
    const requestedDate = new Date(date + 'T00:00:00+05:30')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (requestedDate < today) {
      return NextResponse.json(
        { error: 'Cannot check availability for past dates' },
        { status: 400 }
      )
    }

    const result = await getAvailableSlots(date)

    return NextResponse.json({
      success: true,
      date,
      slots: result.slots,
      calendarConnected: result.calendarConnected,
    })
  } catch (error) {
    console.error('Calendar availability error:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}
