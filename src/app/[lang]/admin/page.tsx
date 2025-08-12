'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

export default function AdminDashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const lang = pathname?.split('/')[1] ?? 'en'
  const [loading, setLoading] = useState(false)

  async function logout() {
    setLoading(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.replace(`/${lang}/admin/login`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      {/* ...content... */}
      <button className="btn btn-ghost" onClick={() => void logout()} disabled={loading}>
        {loading ? 'Logging out…' : 'Log out'}
      </button>
    </div>
  )
}
