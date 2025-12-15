'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.replace(process.env.NEXT_PUBLIC_DASHBOARD_URL || '/dashboard')
      }
      setCheckingSession(false)
    })
  }, [router])

 async function handleLogin(e: React.FormEvent) {
  e.preventDefault()
  setLoading(true)
  setMessage('')

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : 'http://localhost:3000/dashboard'

onst { error } = await supabase.auth.signInWithOtp({
  email: email.trim().toLowerCase(), // optional: good practice
  options: {
    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
  },
});

  setLoading(false)
  if (error) {
    setMessage(`Error: ${error.message}`)
  } else {
    setMessage('Magic link sent! Check your email (including spam). A new link has been sent.')
  }
}

  if (checkingSession) {
    return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading…</p>
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: 8 }}
        >
          {loading ? 'Sending…' : 'Send Magic Link'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
