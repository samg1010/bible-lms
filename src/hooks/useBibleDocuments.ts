'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient' // adjust if needed

export type BibleDocument = {
  id: string
  title: string
  description: string | null
  storage_path: string
  version: string
  publicUrl: string
}

export function useBibleDocuments() {
  const [documents, setDocuments] = useState<BibleDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBibles() {
      const { data, error } = await supabase
        .from<BibleDocument>('bible_documents')
        .select('*')

      if (error) {
        console.error('Error fetching Bible documents:', error)
        setDocuments([])
      } else {
        // Add public URL for each
        const withUrls = (data || []).map((doc) => ({
          ...doc,
          publicUrl: supabase.storage.from('bible-documents').getPublicUrl(doc.storage_path).data.publicUrl,
        }))
        setDocuments(withUrls)
      }
      setLoading(false)
    }

    fetchBibles()
  }, [])

  return { documents, loading }
}