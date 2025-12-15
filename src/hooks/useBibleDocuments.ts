// src/hooks/useBibleDocuments.ts
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'  // or supabaseClient as supabase

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
      setLoading(true)
      const { data, error } = await supabase
        .from('bible_documents')  // ← Remove the <BibleDocument>
        .select('*')

      if (error) {
        console.error('Error fetching Bible documents:', error)
        setDocuments([])
      } else {
        const withUrls = (data || []).map((doc: any) => ({
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