// prisma/seed.ts
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from '../src/lib/prisma'

async function main() {
  const email = (process.env.ADMIN_SEED_EMAIL ?? 'lipostylee@gmail.com').toLowerCase()
  const plain = process.env.ADMIN_SEED_PASSWORD ?? '1234'

  const count = await prisma.admin.count()
  if (count > 0) {
    console.log('Admin already exists. Skipping.')
    return
  }

  const hash = bcrypt.hashSync(plain, 10)
  await prisma.admin.create({ data: { email, passwordHash: hash } })

  console.log(`✅ Seeded admin: ${email}`)
  console.log('👉 After first login, remove ADMIN_SEED_PASSWORD from .env.local')
}

main().finally(() => prisma.$disconnect())
