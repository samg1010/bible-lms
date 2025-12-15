'use client'

import { UserFile } from '../types'

type Props = {
  doc: UserFile
  progress: number
  onUpdateProgress: (id: string, percentage: number) => void
  onViewInDashboard: (doc: UserFile) => void
  onOpenNewTab: (path: string) => Promise<void>
  generatingUrlFor: string | null
}

export default function DocumentItem({
  doc,
  progress,
  onUpdateProgress,
  onViewInDashboard,
  onOpenNewTab,
  generatingUrlFor,
}: Props) {
  return (
    <li style={{ marginBottom: 20, padding: 15, border: '1px solid #ddd', borderRadius: 8, background: '#fafafa' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong style={{ fontSize: '1.1em' }}>{doc.name}</strong>
          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => onViewInDashboard(doc)}
              style={{ marginRight: 12, padding: '6px 12px', background: '#0066cc', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              View in Dashboard
            </button>
            <button
              onClick={() => onOpenNewTab(doc.url)}
              disabled={generatingUrlFor === doc.id}
              style={{ padding: '6px 12px', background: '#444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              {generatingUrlFor === doc.id ? 'Opening...' : 'Open in New Tab'}
            </button>
          </div>
        </div>
        <span style={{ fontWeight: 'bold' }}>{progress}% read</span>
      </div>

      <div style={{ marginTop: 15 }}>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => onUpdateProgress(doc.id, Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', color: '#666', marginTop: 5 }}>
          <span>Not started</span>
          <span>Completed</span>
        </div>
      </div>
    </li>
  )
}