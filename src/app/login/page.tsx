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
    const handleSession = async () => {
      // Check if user is already signed in or just arrived via magic link
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        router.replace('/dashboard')
      }
      setCheckingSession(false)
    }

    handleSession()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        router.replace('/dashboard')
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    })

    setLoading(false)
    setMessage(error ? error.message : 'Magic link sent! Check your email.')
  }

  if (checkingSession) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading…</p>

  return (
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 8 }}>
          {loading ? 'Sending…' : 'Send Magic Link'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
