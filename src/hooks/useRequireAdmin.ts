'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

interface UseRequireAdminProps {
  allowedEmails?: string[] // optional whitelist
  requiredRole?: string     // default: 'admin'
}

export function useRequireAdmin({ allowedEmails = [], requiredRole = 'admin' }: UseRequireAdminProps = {}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        router.replace('/login')
        return
      }

      const userEmail = session.user.email || '' // ← ensure string

      // Fetch user profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (
        error ||
        profile?.role !== requiredRole ||
        (allowedEmails.length > 0 && !allowedEmails.includes(userEmail))
      ) {
        router.replace('/login')
        return
      }

      setIsAdmin(true)
      setLoading(false)
    }

    checkAdmin()
  }, [router, allowedEmails, requiredRole])

  return { loading, isAdmin }
}
