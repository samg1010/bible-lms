'use client'

import { useState } from 'react'
import UploadSection from './components/UploadSection'
import PdfViewer from './components/PdfViewer'
import BibleSection from './components/BibleSection'
import DocumentList from './components/DocumentList'
import { useDashboardData } from '@/hooks/useDashboardData'
import { supabase } from '@/lib/supabaseClient' // adjust path if needed
import { UserFile } from './types'

export default function DashboardPage() {
  const { documents, progress, loading, error, refetch } = useDashboardData()

  const [generatingUrlFor, setGeneratingUrlFor] = useState<string | null>(null)
  const [viewerUrl, setViewerUrl] = useState<string | null>(null)
  const [viewerDocName, setViewerDocName] = useState<string | null>(null)
  const [viewerLoading, setViewerLoading] = useState(false)

  const getSignedUrl = async (path: string): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from('user-files')
      .createSignedUrl(path, 3600) // 1 hour expiry

    if (error) {
      console.error('Signed URL error:', error)
      return null
    }
    return data.signedUrl
  }

  // For personal documents
  const openInDashboard = async (doc: UserFile) => {
    setViewerLoading(true)
    setViewerDocName(doc.name)
    const url = await getSignedUrl(doc.url)
    setViewerUrl(url)
    setViewerLoading(false)
  }

  // For shared Bible documents (public URLs – no signed URL needed)
  const openBibleInDashboard = (url: string, name: string) => {
    setViewerUrl(url)
    setViewerDocName(name)
    setViewerLoading(false)
  }

  const openInNewTab = async (path: string) => {
    setGeneratingUrlFor(path)
    const url = await getSignedUrl(path)
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    setGeneratingUrlFor(null)
  }

  const updateProgress = async (documentId: string, percentage: number) => {
    const { error: upsertError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: documents.find(d => d.id === documentId)?.user_id,
        document_id: documentId,
        progress_percentage: percentage,
        last_read_at: new Date().toISOString(),
      })

    if (upsertError) {
      console.error('Progress update error:', upsertError)
    } else {
      refetch() // Refresh progress data
    }
  }

  if (loading) return <p>Loading your dashboard…</p>
  if (error) return <p>Error loading data: {error}</p>

  return (
    <div style={{ maxWidth: 960, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ marginBottom: 40 }}>Bible LMS Dashboard</h1>

      <UploadSection onUploadSuccess={refetch} />

      <PdfViewer
        url={viewerUrl}
        docName={viewerDocName}
        onClose={() => {
          setViewerUrl(null)
          setViewerDocName(null)
        }}
        loading={viewerLoading}
      />

      <BibleSection onViewInDashboard={openBibleInDashboard} />

      <h2 style={{ marginTop: 60 }}>Your Personal Documents ({documents.length})</h2>

      <DocumentList
        documents={documents}
        progressData={progress}
        onUpdateProgress={updateProgress}
        onViewInDashboard={openInDashboard}
        onOpenNewTab={openInNewTab}
        generatingUrlFor={generatingUrlFor}
      />
    </div>
  )
}