'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
export const dynamic = 'force-dynamic';
export default function VerifyPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [msg, setMsg] = useState('Verifying your magic link...')

  useEffect(() => {
    // Extract hash params from URL
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const token_hash = params.get('token_hash')
    const type = params.get('type') as 'signup' | 'magiclink' | 'recovery' | 'email' | null

    if (!token_hash || !type) {
      setStatus('error')
      setMsg('Invalid or expired link.')
      return
    }

    // Verify the OTP token
    supabase.auth.verifyOtp({
      token_hash,
      type,
    }).then(({ data, error }) => {
      if (error) {
        console.error('Verify error:', error)
        setStatus('error')
        setMsg(`Verification failed: ${error.message}`)
      } else if (data.session) {
        setStatus('success')
        setMsg('Signed in successfully! Redirecting...')
        setTimeout(() => router.replace('/dashboard'), 1000)
      }
    })

    // Fallback listener
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setStatus('success')
        setMsg('Welcome!')
        router.replace('/dashboard')
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [router])

  return (
    <div style={{ padding: 60, textAlign: 'center' }}>
      <h1>{status === 'processing' ? 'Processing...' : status === 'success' ? 'Success!' : 'Error'}</h1>
      <p style={{ fontSize: '1.2em' }}>{msg}</p>
    </div>
  )
}