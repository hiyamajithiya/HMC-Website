import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@himanshumajithiya.com'
  const password = 'Admin@123'
  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log('Admin user created:')
  console.log('Email:', email)
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
