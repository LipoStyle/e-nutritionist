import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const ADMIN_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? 'dev-secret-change-me')

export async function requireAdmin() {
  const token = cookies().get('admin_token')?.value
  if (!token) throw new Error('Unauthorized')
  const { payload } = await jwtVerify(token, ADMIN_SECRET)
  if (payload?.role !== 'admin') throw new Error('Forbidden')
}


// do i need this i have an uth.ts in my src file 