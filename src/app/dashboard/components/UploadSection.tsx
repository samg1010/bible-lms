'use client'

import { useState } from 'react'
import { useUploadDocument } from '@/hooks/useUploadDocument'

type Props = {
  onUploadSuccess?: () => void
}

export default function UploadSection({ onUploadSuccess }: Props = {}) {
  const [file, setFile] = useState<File | null>(null)
  const { upload, uploading, error } = useUploadDocument({
    onSuccess: onUploadSuccess,
  })

  const handleUpload = async () => {
    if (!file) return
    await upload(file)
    setFile(null) // clear after upload
  }

  return (
    <div style={{ marginBottom: 50, padding: 30, background: '#e8f5e8', borderRadius: 16, border: '2px dashed #4caf50', textAlign: 'center' }}>
      <h3 style={{ marginTop: 0, color: '#2e7d32' }}>Upload a Personal Bible Document (PDF)</h3>
      
      <label 
        htmlFor="file-upload"
        style={{
          display: 'inline-block',
          padding: '16px 32px',
          background: '#4caf50',
          color: 'white',
          fontSize: '1.1em',
          fontWeight: 'bold',
          borderRadius: 8,
          cursor: 'pointer',
          marginBottom: 20,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        Choose PDF File
      </label>
      
      <input
        id="file-upload"
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        style={{ display: 'none' }} // hidden but triggered by label
        disabled={uploading}
      />

      {file && (
        <p style={{ margin: '20px 0', fontSize: '1.1em', color: '#2e7d32' }}>
          Selected: <strong>{file.name}</strong>
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{
          padding: '14px 40px',
          background: (!file || uploading) ? '#aaa' : '#2e7d32',
          color: 'white',
          fontSize: '1.2em',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: 8,
          cursor: (!file || uploading) ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}
      >
        {uploading ? 'Uploading... Please wait' : 'Upload to My Documents'}
      </button>

      {error && (
        <p style={{ color: 'red', marginTop: 20, fontWeight: 'bold' }}>
          Upload failed: {error}
        </p>
      )}
    </div>
  )
}