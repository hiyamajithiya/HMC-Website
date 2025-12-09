import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// Helper to check admin status
async function checkAdmin() {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: 'Unauthorized', status: 401 }
  }

  const isAdmin = session.user.email === 'info@himanshumajithiya.com' ||
                  session.user.email === 'admin@himanshumajithiya.com'

  if (!isAdmin) {
    return { error: 'Forbidden', status: 403 }
  }

  return { session }
}

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

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    })

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
