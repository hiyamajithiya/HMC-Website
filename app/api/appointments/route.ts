import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
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

    // Parse the date
    const appointmentDate = new Date(date)
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
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
