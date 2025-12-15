'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verify = async () => {
      const tokenHash = searchParams.get('token_hash')
      const type = searchParams.get('type') || 'magiclink'
      const next = searchParams.get('next') || '/dashboard'

      if (!tokenHash) {
        setError('Invalid or missing token.')
        setLoading(false)
        return
      }

      // Complete login using Supabase verifyOtp
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as 'magiclink', // type assertion
      })

      if (verifyError) {
        console.error('Magic link verification failed:', verifyError.message)
        setError(verifyError.message)
        setLoading(false)
        return
      }

      // Success: redirect to next page
      router.replace(next)
    }

    verify()
  }, [router, searchParams])

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Verifying…</p>
  if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</p>
  return null
}
