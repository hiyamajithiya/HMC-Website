import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { authConfig } from './auth.config'
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  // @ts-ignore - Type conflict between adapter versions
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Login ID or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        selectedUserId: { label: 'Selected User ID', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Please enter your login ID/email and password')
        }

        const identifier = credentials.identifier as string
        const password = credentials.password as string
        const selectedUserId = credentials.selectedUserId as string | undefined

        // If a specific user is selected (from account selection page)
        if (selectedUserId) {
          const user = await prisma.user.findUnique({
            where: { id: selectedUserId },
          })

          if (!user) {
            throw new Error('Selected user not found')
          }

          if (!user.isActive) {
            throw new Error('Your account has been deactivated')
          }

          const isPasswordValid = await bcrypt.compare(password, user.password)
          if (!isPasswordValid) {
            throw new Error('Invalid password')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        }

        // Check if identifier looks like an email
        const isEmail = identifier.includes('@')

        if (isEmail) {
          // Find all users with this email
          const usersWithEmail = await prisma.user.findMany({
            where: { email: identifier },
          })

          if (usersWithEmail.length === 0) {
            throw new Error('No user found with this email')
          }

          if (usersWithEmail.length === 1) {
            // Single user with this email - direct login
            const user = usersWithEmail[0]

            if (!user.isActive) {
              throw new Error('Your account has been deactivated')
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
              throw new Error('Invalid password')
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              image: user.image,
            }
          }

          // Multiple users with this email - need account selection
          let validUsers = []
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
            throw new Error('Invalid password')
          }

          // Throw special error with user data for account selection
          throw new Error(`MULTI_ACCOUNT:${JSON.stringify(validUsers)}`)
        } else {
          // Login with loginId - direct login
          const user = await prisma.user.findUnique({
            where: { loginId: identifier },
          })

          if (!user) {
            throw new Error('No user found with this login ID')
          }

          if (!user.isActive) {
            throw new Error('Your account has been deactivated')
          }

          const isPasswordValid = await bcrypt.compare(password, user.password)
          if (!isPasswordValid) {
            throw new Error('Invalid password')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        }
      },
    }),
  ],
})
