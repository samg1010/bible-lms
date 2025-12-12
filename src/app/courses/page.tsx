import { supabase } from '@/lib/supabase'

export default async function Courses() {
  const { data: courses } = await supabase.from('courses').select('*')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">All Courses</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {courses?.map(course => (
          <div key={course.id} className="card">
            <div className="p-6">
              <h3 className="text-2xl font-bold">{course.title}</h3>
              <p className="text-gray-600 mt-2">{course.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}