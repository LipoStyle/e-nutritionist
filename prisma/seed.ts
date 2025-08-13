import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1) Ensure an admin user exists
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@enutritionist.com'
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin12345' // change in .env before running in real envs
  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  })
  console.log(`✔ Admin ready: ${email} / (your .env password)`)

  // 2) A couple of default hero settings so pages show something
  const heroes = [
    {
      pageKey: 'home', language: 'en',
      title: 'Welcome to E‑Nutritionist',
      description: 'Personalized nutrition guidance to help you feel and perform your best.',
      message: 'Ready to start?',
      bookText: 'Book Now',
      bookHref: '/en/book-consultation',
      bgImage: '/assets/images/hero/home.jpg',
      overlayOpacity: 0.6, offsetHeader: true, height: 'tall',
    },
    {
      pageKey: 'about', language: 'en',
      title: 'About Us',
      description: 'Learn about our approach, philosophy, and science-backed methods.',
      message: 'Questions?',
      bookText: 'Contact Us',
      bookHref: '/en/contact',
      bgImage: '/assets/images/hero/about.jpg',
      overlayOpacity: 0.6, offsetHeader: true, height: 'default',
    },
  ]

  for (const h of heroes) {
    await prisma.heroSetting.upsert({
      where: { hero_page_lang_unique: { pageKey: h.pageKey, language: h.language } },
      update: {},
      create: h,
    })
  }
  console.log('✔ Seeded default hero settings for EN (home, about)')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
