import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'
import { notifyRole } from '@/lib/push-notifications'
import { getAvailableSlots, createCalendarEvent } from '@/lib/google-calendar'
import { sendAppointmentEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

// GET - Fetch authenticated user's appointments
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const upcoming = searchParams.get('upcoming')

    const whereClause: any = { userId: session.user.id }

    if (status) {
      whereClause.status = status
    }

    if (upcoming === 'true') {
      whereClause.date = { gte: new Date() }
      whereClause.status = { in: ['PENDING', 'CONFIRMED'] }
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Failed to fetch user appointments:', error)
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}

// POST - Book an appointment (authenticated mobile users, no OTP required)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { service, date, timeSlot, message } = body

    if (!service || !date || !timeSlot) {
      return NextResponse.json({ error: 'Service, date and time slot are required' }, { status: 400 })
    }

    const appointmentDate = new Date(date)
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Check Google Calendar availability (authenticated users skip OTP but still respect calendar)
    const dateStr = date.split('T')[0]
    const availability = await getAvailableSlots(dateStr)
    if (availability.calendarConnected && !availability.slots.includes(timeSlot)) {
      return NextResponse.json(
        { error: 'This time slot is no longer available. Please select a different time.' },
        { status: 409 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        name: user.name || 'Client',
        email: user.email || '',
        phone: user.phone || '',
        service,
        date: appointmentDate,
        timeSlot,
        message: message || null,
        status: 'PENDING',
        userId: user.id,
      },
    })

    // Create Google Calendar event (non-blocking)
    try {
      const eventId = await createCalendarEvent({
        name: user.name || 'Client',
        email: user.email || '',
        phone: user.phone || '',
        service,
        date: dateStr,
        timeSlot,
        message: message || undefined,
      })
      if (eventId) {
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: { googleEventId: eventId },
        })
      }
    } catch { /* non-blocking */ }

    // Send admin push notification (non-blocking)
    try {
      await notifyRole('ADMIN', 'New Appointment Booked',
        `${user.name || 'A client'} booked ${service} on ${appointmentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at ${timeSlot}`,
        { type: 'appointment', appointmentId: appointment.id }
      )
    } catch { /* non-blocking */ }

    // Send confirmation email (non-blocking)
    try {
      await sendAppointmentEmail({
        name: user.name || 'Client',
        email: user.email || '',
        phone: user.phone || '',
        service,
        date: appointmentDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        timeSlot,
        message: message || undefined,
      })
    } catch { /* non-blocking */ }

    return NextResponse.json({ success: true, appointmentId: appointment.id })
  } catch (error) {
    console.error('Failed to book appointment:', error)
    return NextResponse.json({ error: 'Failed to book appointment' }, { status: 500 })
  }
}
