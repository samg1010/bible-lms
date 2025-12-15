'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function VerifyOtpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { data: { session }, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    })

    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
    } else if (session?.user) {
      // Redirect to dashboard after successful login
      router.replace('/dashboard')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', textAlign: 'center' }}>
      <h1>Enter OTP Code</h1>
      <p>Check your email for the 6‑digit code then enter it below.</p>

      <form onSubmit={handleVerifyOtp}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6‑digit code"
          required
          maxLength={6}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: 8 }}
        >
          {loading ? 'Verifying…' : 'Verify OTP'}
        </button>
      </form>

      {errorMsg && <p style={{ color: 'red', marginTop: 12 }}>{errorMsg}</p>}
    </div>
  )
}
