// hooks/useUploadDocument.ts
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useSession } from '@/hooks/useSession'

type UploadResult = {
  success: boolean
  document?: {
    id: string
    name: string
    url: string
  }
  error?: string
}

type UseUploadDocumentReturn = {
  upload: (file: File) => Promise<UploadResult>
  uploading: boolean
  error: string | null
  resetError: () => void
}

export function useUploadDocument(options?: { onSuccess?: () => void }): UseUploadDocumentReturn {
  const { user } = useSession()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetError = () => setError(null)

  const upload = async (file: File): Promise<UploadResult> => {
    if (!user) {
      setError('You must be logged in to upload files')
      return { success: false, error: 'Not authenticated' }
    }

    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      // Optional: restrict to PDFs only (recommended for Bible LMS)
      // Remove or adjust if you want to allow other types
      setError('Only PDF files are allowed')
      return { success: false, error: 'Invalid file type' }
    }

    setUploading(true)
    setError(null)

    try {
      // 1. Generate unique filename
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      // 2. Upload to Supabase Storage (private bucket)
      const { data: storageData, error: storageError } = await supabase.storage
        .from('user-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (storageError) {
        if (storageError.message.includes('duplicate')) {
          setError('File already exists. Try renaming it.')
        } else {
          setError(storageError.message)
        }
        return { success: false, error: storageError.message }
      }

      // 3. Insert metadata into user_files table
      const { data: dbData, error: dbError } = await supabase
        .from('user_files')
        .insert({
          user_id: user.id,
          name: file.name,
          url: filePath, // store path only
        })
        .select()
        .single()

      if (dbError) {
        // Optional: clean up storage if DB insert fails
        await supabase.storage.from('user-files').remove([filePath])
        setError(dbError.message)
        return { success: false, error: dbError.message }
      }

      // Success!
      options?.onSuccess?.()

      return {
        success: true,
        document: {
          id: dbData.id,
          name: dbData.name,
          url: dbData.url,
        },
      }
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Upload failed')
      return { success: false, error: err.message || 'Unknown error' }
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, error, resetError }
}