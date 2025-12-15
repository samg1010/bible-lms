'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Props = {
  mode: 'login' | 'signup'
  redirectTo: string
  title: string
}

export default function AuthForm({ mode, redirectTo, title }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [linkSent, setLinkSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${redirectTo}`,
      },
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for a magic login link ✨')
      setLinkSent(true) // disable form after sending
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-4 py-2"
          disabled={linkSent}
        />

        <button
          disabled={loading || linkSent}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading
            ? 'Sending...'
            : linkSent
            ? 'Link Sent ✅'
            : mode === 'login'
            ? 'Send Login Link'
            : 'Create Account'}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
      )}
    </div>
  )
}
