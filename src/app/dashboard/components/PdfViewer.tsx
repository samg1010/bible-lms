'use client'

type Props = {
  url: string | null
  docName: string | null
  onClose: () => void
  loading?: boolean
}

export default function PdfViewer({ url, docName, onClose, loading = false }: Props) {
  if (!url || !docName) return null

  return (
    <div style={{ marginBottom: 40, border: '1px solid #ccc', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ padding: 12, background: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.1em' }}>Reading: {docName}</h3>
        <button 
          onClick={onClose} 
          style={{ padding: '6px 12px', background: '#666', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          Close Viewer
        </button>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#fff' }}>
          <p>Loading PDF...</p>
        </div>
      ) : (
        <iframe
          src={url}
          width="100%"
          height="900px"
          style={{ border: 'none' }}
          title={`PDF Viewer - ${docName}`}
        />
      )}
    </div>
  )
}