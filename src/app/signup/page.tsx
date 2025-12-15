'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function VerifyPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('Signing you in… Please wait.')

  useEffect(() => {
    // Handle the magic link token from URL (hash params)
    const handleMagicLink = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setStatus('error')
        setMessage('Verification failed. Please try again.')
        console.error('getSession error:', error)
        return
      }

      if (data.session) {
        setStatus('success')
        setMessage('Signed in successfully! Redirecting...')
        router.replace('/dashboard')
        return
      }

      // If no session yet, listen for changes (fallback)
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setStatus('success')
          setMessage('Signed in! Redirecting...')
          router.replace('/dashboard')
        } else if (event === 'SIGNED_OUT') {
          setStatus('error')
          setMessage('Session expired. Please request a new link.')
        }
      })

      return () => listener.subscription.unsubscribe()
    }

    handleMagicLink()
  }, [router])

  return (
    <div style={{ padding: 60, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ fontSize: '2em', marginBottom: 20 }}>
        {status === 'verifying' && 'Verifying your magic link…'}
        {status === 'success' && 'Welcome!'}
        {status === 'error' && 'Verification Failed'}
      </h1>
      <p style={{ fontSize: '1.2em', color: '#555' }}>{message}</p>
      {status === 'verifying' && <p style={{ marginTop: 30, color: '#888' }}>This may take a few seconds.</p>}
    </div>
  )
}