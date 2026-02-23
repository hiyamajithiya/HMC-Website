import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-check'
import { getAvailableSlots } from '@/lib/google-calendar'

export const dynamic = 'force-dynamic'

// GET /api/user/available-slots?date=YYYY-MM-DD
// Returns available time slots for a given date (Google Calendar aware)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') // YYYY-MM-DD

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid date. Use YYYY-MM-DD format.' }, { status: 400 })
    }

    // Reject past dates
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selected = new Date(date)
    if (selected < today) {
      return NextResponse.json({ slots: [], calendarConnected: false })
    }

    const { slots, calendarConnected } = await getAvailableSlots(date)
    return NextResponse.json({ slots, calendarConnected })
  } catch (error) {
    console.error('Failed to fetch available slots:', error)
    return NextResponse.json({ error: 'Failed to fetch available slots' }, { status: 500 })
  }
}
