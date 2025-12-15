'use client'

export default function TestLogin() {
  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Test Login</h1>
      <input type="email" placeholder="Enter email" style={{ width: '100%', padding: 8 }} />
      <button style={{ width: '100%', padding: 8 }}>Send Login Link</button>
    </div>
  )
}
