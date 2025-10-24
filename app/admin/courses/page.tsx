'use client'

import { useEffect, useState } from 'react'
import { createClientSupabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingCourse, setDeletingCourse] = useState<string | null>(null)
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

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    setDeletingCourse(courseId)
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete course')
      }

      toast.success(`Course "${courseTitle}" deleted successfully`)
      // Remove the course from the local state
      setCourses(courses.filter(course => course.id !== courseId))
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setDeletingCourse(null)
    }
  }

  const handlePreviewCourse = (courseSlug: string) => {
    // Open course preview in a new tab with admin preview mode
    window.open(`/courses/${courseSlug}?preview=admin`, '_blank')
  }

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
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={course.published ? "default" : "secondary"}>
                      {course.published ? "Published" : "Draft"}
                    </Badge>
                    {course.featured && (
                      <Badge variant="outline">Featured</Badge>
                    )}
                    {course.level && (
                      <Badge variant="outline">{course.level}</Badge>
                    )}
                    {course.category && (
                      <Badge variant="outline">{course.category}</Badge>
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
                      onClick={() => handlePreviewCourse(course.slug)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = `/admin/courses/${course.slug}/edit`}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={deletingCourse === course.id}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Course</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{course.title}"? This action cannot be undone and will also delete all associated cohorts, enrollments, and progress data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCourse(course.id, course.title)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Course
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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