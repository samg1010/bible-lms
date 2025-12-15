'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout error:', error.message)
    } else {
      router.replace(process.env.NEXT_PUBLIC_LOGIN_URL || '/login')
    }
  }

  return (
    <button
      onClick={handleLogout}
      style={{ padding: '8px 16px', cursor: 'pointer' }}
    >
      Logout
    </button>
  )
}
