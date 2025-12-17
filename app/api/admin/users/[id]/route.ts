import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Helper to check admin status
async function checkAdmin() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  const isAdmin = session.user.role === 'ADMIN'

  if (!isAdmin) {
    return { error: 'Forbidden', status: 403 }
  }

  return { session }
}

// GET single user
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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        loginId: true,
        phone: true,
        dateOfBirth: true,
        role: true,
        isActive: true,
        services: true,
        groupId: true,
        group: {
          select: {
            id: true,
            name: true,
          }
        },
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PATCH update user
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
    const { isActive, role, name, phone, email, dateOfBirth, services, groupId, newGroupName } = body

    // Handle group - create new if newGroupName provided, otherwise use existing groupId
    let finalGroupId: string | null | undefined = undefined
    if (newGroupName && newGroupName.trim()) {
      // Create new group if doesn't exist
      const existingGroup = await prisma.clientGroup.findUnique({
        where: { name: newGroupName.trim() }
      })
      if (existingGroup) {
        finalGroupId = existingGroup.id
      } else {
        const newGroup = await prisma.clientGroup.create({
          data: { name: newGroupName.trim() }
        })
        finalGroupId = newGroup.id
      }
    } else if (groupId !== undefined) {
      finalGroupId = groupId || null
    }

    // Parse date of birth if provided
    const parsedDOB = dateOfBirth ? new Date(dateOfBirth) : undefined

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(role !== undefined && { role }),
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email: email || null }),
        ...(parsedDOB !== undefined && { dateOfBirth: parsedDOB }),
        ...(services !== undefined && { services: Array.isArray(services) ? services : [] }),
        ...(finalGroupId !== undefined && { groupId: finalGroupId }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        loginId: true,
        phone: true,
        dateOfBirth: true,
        role: true,
        isActive: true,
        services: true,
        groupId: true,
        group: {
          select: {
            id: true,
            name: true,
          }
        },
        createdAt: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to update user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE user
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

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
