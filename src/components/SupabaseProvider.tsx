// src/components/SupabaseProvider.tsx
'use client' // Client component for auth state

import { createBrowserClient } from '@supabase/ssr'
import { useEffect } from 'react'

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // Revalidate on auth change
      window.location.reload()
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div>
      {children}
    </div>
  )
}