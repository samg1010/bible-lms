'use client'

import DocumentItem from './DocumentItem'
import { UserFile, UserProgress } from '../types'

type Props = {
  documents: UserFile[]
  progressData: UserProgress[]
  onUpdateProgress: (id: string, percentage: number) => void
  onViewInDashboard: (doc: UserFile) => void
  onOpenNewTab: (path: string) => Promise<void>
  generatingUrlFor: string | null
}

export default function DocumentList({
  documents,
  progressData,
  onUpdateProgress,
  onViewInDashboard,
  onOpenNewTab,
  generatingUrlFor,
}: Props) {
  if (documents.length === 0) {
    return <p>No personal documents uploaded yet.</p>
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {documents.map((doc) => {
        const prog = progressData.find((p) => p.document_id === doc.id)
        const percentage = prog?.progress_percentage ?? 0

        return (
          <DocumentItem
            key={doc.id}
            doc={doc}
            progress={percentage}
            onUpdateProgress={onUpdateProgress}
            onViewInDashboard={onViewInDashboard}
            onOpenNewTab={onOpenNewTab}
            generatingUrlFor={generatingUrlFor}
          />
        )
      })}
    </ul>
  )
}