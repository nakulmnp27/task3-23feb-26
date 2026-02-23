import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcrypt'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined')
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
} as any)

async function main() {
  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER' },
  })

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  })

  const adminEmail = 'admin@example.com'

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@123', 10)

    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'System Admin',
        roleId: adminRole.id,
        isActive: true,
      },
    })
  }

  console.log("Seeding completed broo...")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })