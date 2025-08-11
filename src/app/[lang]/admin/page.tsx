'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const logout = async () => {
    setLoading(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/en/admin/login') // middleware will correct the lang if needed
  }

  return (
    <div className="card">
      <h1 style={{ marginBottom: '1rem' }}>Admin Dashboard</h1>
      <p style={{ marginBottom: '1.5rem' }}>Welcome! Choose a section to manage.</p>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
        <a className="btn btn-primary" href="./services">Manage Service Plans</a>
        <a className="btn btn-primary" href="./blogs">Manage Blogs</a>
        <a className="btn btn-primary" href="./recipes">Manage Recipes</a>
        <a className="btn btn-primary" href="./bookings">View Bookings</a>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <button className="btn btn-ghost" onClick={logout} disabled={loading}>
          {loading ? 'Logging out…' : 'Log out'}
        </button>
      </div>
    </div>
  )
}
