'use client'

import { useRequireAdmin } from '@/hooks/useRequireAdmin'

export default function AdminPage() {
  // Check for admin role and optional whitelist
  const { loading, isAdmin } = useRequireAdmin({
    allowedEmails: ['admin@yourdomain.com'], // optional
    requiredRole: 'admin'                     // default
  })

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: 40 }}>Checking permissions…</p>
  }

  if (!isAdmin) {
    return <p style={{ textAlign: 'center', marginTop: 40 }}>Access denied</p>
  }

  return (
    <div style={{ maxWidth: 800, margin: '80px auto', textAlign: 'center' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, admin! You have full access.</p>
      {/* Add admin-specific components here */}
    </div>
  )
}
