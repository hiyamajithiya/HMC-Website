import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@himanshumajithiya.com'
  const password = 'Admin@123'
  const hashedPassword = await bcrypt.hash(password, 12)

  // For admin users, loginId equals email (loginId is unique, email is not)
  const user = await prisma.user.upsert({
    where: { loginId: email },
    update: {},
    create: {
      email,
      loginId: email,
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log('Admin user created:')
  console.log('Email:', email)
  console.log('Login ID:', email)
  console.log('Password:', password)
  console.log('User ID:', user.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
