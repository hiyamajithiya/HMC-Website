import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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

// Helper to generate loginId from name and date of birth
// Format: first 4 letters of name (lowercase) + first 2 digits of DOB
// Example: "Himanshu Majithiya" + "25/04/1986" = "hima25"
function generateLoginId(name: string, dateOfBirth: Date): string {
  // Get first 4 letters of name (remove spaces and special chars)
  const cleanName = name.replace(/[^a-zA-Z]/g, '').toLowerCase()
  const namePart = cleanName.substring(0, 4)

  // Get day part (first 2 digits of DOB)
  const day = dateOfBirth.getDate().toString().padStart(2, '0')

  return namePart + day
}

// Helper to ensure unique loginId by appending number if needed
async function ensureUniqueLoginId(baseLoginId: string): Promise<string> {
  let loginId = baseLoginId
  let counter = 1

  while (true) {
    const existing = await prisma.user.findUnique({
      where: { loginId }
    })

    if (!existing) {
      return loginId
    }

    // Append counter to make unique
    loginId = `${baseLoginId}${counter}`
    counter++
  }
}

// GET all users
export async function GET() {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json(users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// Default password for new users
const DEFAULT_PASSWORD = 'Password123'

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const body = await request.json()
    const { name, email, phone, dateOfBirth, role, services, groupId, newGroupName } = body

    // Validate required fields for clients
    if (role !== 'ADMIN') {
      if (!name || !dateOfBirth) {
        return NextResponse.json(
          { error: 'Name and Date of Birth/Incorporation are required for clients' },
          { status: 400 }
        )
      }
    }

    // For admin users, email is required
    if (role === 'ADMIN' && !email) {
      return NextResponse.json(
        { error: 'Email is required for admin users' },
        { status: 400 }
      )
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }
      // Note: Same email can be used for multiple users/clients
      // Each user has a unique loginId for direct access
      // Email login shows account selection if multiple users share the email
    }

    // Parse date of birth
    const parsedDOB = dateOfBirth ? new Date(dateOfBirth) : null

    // Generate loginId for clients
    let loginId: string | null = null
    if (role !== 'ADMIN' && name && parsedDOB) {
      const baseLoginId = generateLoginId(name, parsedDOB)
      loginId = await ensureUniqueLoginId(baseLoginId)
    } else if (role === 'ADMIN' && email) {
      // For admin, use email as loginId
      loginId = email
    }

    // Hash default password
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10)

    // Handle group - create new if newGroupName provided, otherwise use existing groupId
    let finalGroupId: string | null = null
    if (role !== 'ADMIN') {
      if (newGroupName && newGroupName.trim()) {
        // Create new group
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
      } else if (groupId) {
        finalGroupId = groupId
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email: email || null,
        loginId,
        phone: phone || null,
        dateOfBirth: parsedDOB,
        password: hashedPassword,
        role: role === 'ADMIN' ? 'ADMIN' : 'CLIENT',
        services: Array.isArray(services) ? services : [],
        groupId: finalGroupId,
        isActive: true,
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

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Failed to create user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
