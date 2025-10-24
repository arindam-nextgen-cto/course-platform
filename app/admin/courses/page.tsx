'use client'

import { useEffect, useState } from 'react'
import { createClientSupabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchCourses() {
      try {
        // Get courses from database
        const { data: courses, error } = await supabase
          .from('courses')
          .select('*')
          .order('createdAt', { ascending: false })

        if (error) {
          console.error('Error fetching courses:', error)
          setError('Failed to load courses')
        } else {
          setCourses(courses || [])
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage platform courses</p>
        </div>
        <Button onClick={() => window.location.href = '/admin/courses/create'}>
          Create Course
        </Button>
      </div>

      <div className="grid gap-4">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {course.level && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {course.level}
                      </span>
                    )}
                    {course.category && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        {course.category}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(course.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = `/admin/courses/${course.slug}/edit`}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = `/admin/courses/${course.slug}`}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No courses found</p>
              <Button className="mt-4">Create Your First Course</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}