import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'
import { deleteCalendarEvent } from '@/lib/google-calendar'
import { sendAppointmentConfirmedEmail, sendAppointmentCancelledEmail } from '@/lib/email'
import { notifyUser } from '@/lib/push-notifications'

export const dynamic = 'force-dynamic'

// GET single appointment
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { id } = await params

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Failed to fetch appointment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    )
  }
}

// PATCH update appointment status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    // Fetch existing appointment for email and calendar operations
    const existing = await prisma.appointment.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    // If cancelling, remove from Google Calendar
    if (status === 'CANCELLED' && existing.googleEventId) {
      await deleteCalendarEvent(existing.googleEventId)
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    })

    // Send email notification to client on status change
    const formattedDate = existing.date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    try {
      if (status === 'CONFIRMED') {
        await sendAppointmentConfirmedEmail({
          name: existing.name,
          email: existing.email,
          service: existing.service,
          date: formattedDate,
          timeSlot: existing.timeSlot,
        })
        console.log('Appointment confirmation email sent to:', existing.email)
      } else if (status === 'CANCELLED') {
        await sendAppointmentCancelledEmail({
          name: existing.name,
          email: existing.email,
          service: existing.service,
          date: formattedDate,
          timeSlot: existing.timeSlot,
        })
        console.log('Appointment cancellation email sent to:', existing.email)
      }
    } catch (emailError) {
      console.error('Failed to send status email:', emailError)
      // Don't fail the status update if email fails
    }

    // Push notification to client if appointment is linked to a user
    if (existing.userId) {
      const statusText = status === 'CONFIRMED' ? 'confirmed' : status === 'CANCELLED' ? 'cancelled' : status.toLowerCase()
      notifyUser(existing.userId, 'Appointment Update', `Your appointment on ${formattedDate} has been ${statusText}.`, {
        type: 'appointment',
        appointmentId: id,
        status,
      }).catch(err => console.error('Push notification failed:', err))
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Failed to update appointment:', error)
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

// DELETE appointment
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { id } = await params

    // Remove from Google Calendar before deleting
    const existing = await prisma.appointment.findUnique({
      where: { id },
      select: { googleEventId: true },
    })
    if (existing?.googleEventId) {
      await deleteCalendarEvent(existing.googleEventId)
    }

    await prisma.appointment.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Appointment deleted successfully' })
  } catch (error) {
    console.error('Failed to delete appointment:', error)
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    )
  }
}
