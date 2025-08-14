import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const ADMIN_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? 'dev-secret-change-me'
)

export async function requireAdmin() {
  // ✅ handle both sync/async cookies() typings by awaiting it
  const cookieStore = await cookies() as unknown as {
    get(name: string): { value: string } | undefined
  }

  const token = cookieStore.get('admin_token')?.value
  if (!token) throw new Error('Unauthorized')

  const { payload } = await jwtVerify(token, ADMIN_SECRET)
  if (payload?.role !== 'admin') throw new Error('Forbidden')
}
