import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'  // Already imported

export const dynamic = 'force-dynamic'  // Ensures fresh data on every request

export default async function Home() {
  // Remove this line:
  // const supabase = createClient()  // ❌ DO NOT USE

  // Get current user (magic-link supported)
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch published courses
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, slug, image_url')
    .eq('published', true)
    .order('title')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ...rest of your JSX stays the same */}
    </div>
  )
}
