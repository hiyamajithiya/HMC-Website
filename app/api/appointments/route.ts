import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendAppointmentEmail } from "@/lib/email"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { getAvailableSlots, createCalendarEvent } from "@/lib/google-calendar"

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 appointment bookings per minute per IP
    const ip = getClientIp(request)
    const rateLimit = checkRateLimit(`appointment:${ip}`, { max: 5, windowSeconds: 60 })
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, phone, service, date, timeSlot, message } = body

    // Validate required fields
    if (!name || !email || !phone || !service || !date || !timeSlot) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Verify email was confirmed via OTP
    const verification = await prisma.emailVerification.findFirst({
      where: {
        email: email.toLowerCase(),
        purpose: 'appointment',
        verified: true,
        createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) }, // within last 30 min
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!verification) {
      return NextResponse.json(
        { error: "Please verify your email address before booking." },
        { status: 403 }
      )
    }

    // Parse the date
    const appointmentDate = new Date(date)
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      )
    }

    // Check Google Calendar availability before booking
    const dateStr = date.split('T')[0] // ensure YYYY-MM-DD format
    const availability = await getAvailableSlots(dateStr)
    if (availability.calendarConnected && !availability.slots.includes(timeSlot)) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please select a different time." },
        { status: 409 }
      )
    }

    // Save appointment to database
    const appointment = await prisma.appointment.create({
      data: {
        name,
        email,
        phone,
        service,
        date: appointmentDate,
        timeSlot,
        message: message || null,
        status: 'PENDING',
      },
    })

    // Create Google Calendar event (non-blocking — failure doesn't affect booking)
    try {
      const eventId = await createCalendarEvent({
        name,
        email,
        phone,
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
        console.log("Google Calendar event created:", eventId)
      }
    } catch (calendarError) {
      console.error("Failed to create calendar event:", calendarError)
    }

    // Send email notification (admin + user confirmation)
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (smtpUser && smtpPass) {
      try {
        await sendAppointmentEmail({
          name,
          email,
          phone,
          service,
          date: appointmentDate.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          timeSlot,
          message: message || undefined,
        })
        console.log("Appointment email notification sent")
      } catch (emailError) {
        console.error("Failed to send appointment email:", emailError)
        // Don't fail the request if email fails
      }
    }

    // Clean up used verification record
    await prisma.emailVerification.deleteMany({
      where: {
        email: email.toLowerCase(),
        purpose: 'appointment',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for booking an appointment! Your request has been received successfully. Our team will confirm your appointment shortly.",
        appointmentId: appointment.id
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Appointment booking error:", error)
    return NextResponse.json(
      { error: "An error occurred while booking your appointment. Please try again later." },
      { status: 500 }
    )
  }
}
