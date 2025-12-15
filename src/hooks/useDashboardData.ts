// hooks/useDashboardData.ts
'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { supabase } from '@/lib/supabaseClient'
import { UserFile, UserProgress } from '@/app/dashboard/types'

type DashboardData = {
  documents: UserFile[]
  progress: UserProgress[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useDashboardData(): DashboardData {
  const { user, loading: sessionLoading } = useSession()
  const [documents, setDocuments] = useState<UserFile[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const [{ data: docs, error: docsError }, { data: prog, error: progError }] =
        await Promise.all([
          supabase
            .from<UserFile>('user_files')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),

          supabase
            .from<UserProgress>('user_progress')
            .select('*')
            .eq('user_id', user.id),
        ])

      if (docsError) throw docsError
      if (progError) throw progError

      setDocuments(docs ?? [])
      setProgress(prog ?? [])
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]) // Re-fetch when user changes (login/logout)

  return {
    documents,
    progress,
    loading: loading || sessionLoading,
    error,
    refetch: fetchData,
  }
}