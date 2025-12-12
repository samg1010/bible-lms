// src/app/page.tsx
import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { data: courses } = await supabase.from('courses').select('id, title, slug, image_url').eq('published', true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to Bible LMS</h1>
          <p className="text-xl text-gray-700">Grow deeper in God's Word</p>
        </div>

        {user ? (
          <div className="text-center mb-12">
            <p className="text-lg">Welcome back, {user.email}</p>
            <Link href="/courses" className="btn-primary mt-4 inline-block">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="text-center mb-12">
            <Link href="/login" className="btn-primary mr-4">
              Sign In
            </Link>
            <Link href="/signup" className="btn-secondary">
              Create Account
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {courses?.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`} className="card hover:shadow-xl transition-shadow">
              {course.image_url ? (
                <img src={course.image_url} alt={course.title} className="w-full h-48 object-cover rounded-t-lg" />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-t-lg w-full h-48" />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-600">Click to begin studying</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}