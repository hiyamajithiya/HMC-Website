import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { identifier, password, selectedUserId } = await request.json()

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Please enter your login ID/email and password' },
        { status: 400 }
      )
    }

    // If a specific user is selected (from account selection page)
    if (selectedUserId) {
      const user = await prisma.user.findUnique({
        where: { id: selectedUserId },
      })

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Selected user not found' },
          { status: 400 }
        )
      }

      if (!user.isActive) {
        return NextResponse.json(
          { success: false, error: 'Your account has been deactivated' },
          { status: 400 }
        )
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid password' },
          { status: 400 }
        )
      }

      // Credentials are valid - return success so client can proceed with signIn
      return NextResponse.json({ success: true, userId: user.id })
    }

    // Check if identifier looks like an email
    const isEmail = identifier.includes('@')

    if (isEmail) {
      // Find all users with this email
      const usersWithEmail = await prisma.user.findMany({
        where: { email: identifier },
      })

      if (usersWithEmail.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No user found with this email' },
          { status: 400 }
        )
      }

      if (usersWithEmail.length === 1) {
        // Single user with this email - direct login
        const user = usersWithEmail[0]

        if (!user.isActive) {
          return NextResponse.json(
            { success: false, error: 'Your account has been deactivated' },
            { status: 400 }
          )
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          return NextResponse.json(
            { success: false, error: 'Invalid password' },
            { status: 400 }
          )
        }

        // Credentials are valid
        return NextResponse.json({ success: true, userId: user.id })
      }

      // Multiple users with this email - need account selection
      // First verify password matches at least one account
      const validUsers = []
      for (const user of usersWithEmail) {
        if (user.isActive) {
          const isPasswordValid = await bcrypt.compare(password, user.password)
          if (isPasswordValid) {
            validUsers.push({
              id: user.id,
              name: user.name,
              loginId: user.loginId,
            })
          }
        }
      }

      if (validUsers.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Invalid password' },
          { status: 400 }
        )
      }

      // Return multiple accounts for selection
      return NextResponse.json({
        success: false,
        multiAccount: true,
        accounts: validUsers,
      })
    } else {
      // Login with loginId - direct login
      const user = await prisma.user.findUnique({
        where: { loginId: identifier },
      })

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'No user found with this login ID' },
          { status: 400 }
        )
      }

      if (!user.isActive) {
        return NextResponse.json(
          { success: false, error: 'Your account has been deactivated' },
          { status: 400 }
        )
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid password' },
          { status: 400 }
        )
      }

      // Credentials are valid
      return NextResponse.json({ success: true, userId: user.id })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
