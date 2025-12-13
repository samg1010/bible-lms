// src/app/page.tsx
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
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Bible LMS
          </h1>
          <p className="text-xl text-gray-700">Grow deeper in God's Word</p>
        </div>

        {/* Logged-in vs Logged-out state */}
        {user ? (
          <div className="text-center mb-12">
            <p className="text-lg font-medium">
              Welcome back, <span className="text-purple-600">{user.email}</span>
            </p>
            <Link
              href="/dashboard"
              className="inline-block mt-4 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="text-center mb-12">
            <Link
              href="/login"
              className="inline-block mr-4 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-block px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Create Account
            </Link>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {courses?.length === 0 ? (
            <p className="col-span-full text-center text-gray-600 text-lg">
              No courses published yet.
            </p>
          ) : (
            courses?.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {course.image_url ? (
                  <div className="relative aspect-w-16 aspect-h-9 h-48">
                    <Image
                      src={course.image_url}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-purple-400 to-blue-500 h-48 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {course.title[0]}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600">Click to begin studying</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
