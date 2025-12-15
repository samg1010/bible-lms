'use client'

import { useBibleDocuments } from '@/hooks/useBibleDocuments'

type Props = {
  onViewInDashboard: (url: string, name: string) => void
}

export default function BibleSection({ onViewInDashboard }: Props) {
  const { documents, loading } = useBibleDocuments()

  if (loading) return <p>Loading shared Bible versions...</p>
  if (documents.length === 0) return null

  return (
    <div style={{ margin: '60px 0 40px', padding: 20, background: '#f0f8ff', borderRadius: 12, border: '1px solid #bde0fe' }}>
      <h2 style={{ marginTop: 0 }}>Shared Bible Versions</h2>
      <p style={{ color: '#555', marginBottom: 20 }}>
        These full Bible PDFs are available to all users for study.
      </p>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 15, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {documents.map((doc) => (
          <li key={doc.id} style={{ padding: 15, background: 'white', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <strong style={{ fontSize: '1.1em' }}>{doc.title}</strong> <em>({doc.version})</em>
            {doc.description && <p style={{ margin: '8px 0', fontSize: '0.9em', color: '#666' }}>{doc.description}</p>}
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => onViewInDashboard(doc.publicUrl, doc.title)}
                style={{ marginRight: 12, padding: '6px 12px', background: '#0066cc', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
              >
                View in Dashboard
              </button>
              <a
                href={doc.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0066cc', textDecoration: 'underline' }}
              >
                Open in New Tab
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}