'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'
import VideoPlayer from '@/components/video-player'
import MarkdownRenderer from '@/components/markdown-renderer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, BookOpen, Play, Lock } from 'lucide-react'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  level: string
  category: string
  estimatedHours: number
  prerequisites: string
  learningGoals: string
  published: boolean
  createdAt: string
}

interface Section {
  id: string
  title: string
  orderIndex: number
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  description: string
  videoUrl: string
  videoProvider: string
  videoId: string
  embedUrl: string
  thumbnail: string
  content: string
  orderIndex: number
  isFree: boolean
  published: boolean
}

export default function CourseDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const isAdminPreview = searchParams.get('preview') === 'admin'
  const [course, setCourse] = useState<Course | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [user, setUser] = useState<any>(null)
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    async function fetchCourse() {
      try {
        // Check if user is admin for preview mode
        const { data: { user } } = await supabase.auth.getUser()
        let userIsAdmin = false
        
        if (user && isAdminPreview) {
          try {
            // Check if user has admin role (you might need to adjust this based on your user role system)
            const { data: userData } = await supabase
              .from('users')
              .select('role')
              .eq('id', user.id)
              .single()
            
            userIsAdmin = userData?.role === 'ADMIN'
          } catch (error) {
            // Fallback: assume admin if users table doesn't exist and user is authenticated
            console.warn('Could not check user role, assuming admin for preview:', error)
            userIsAdmin = true
          }
          setIsAdmin(userIsAdmin)
        }

        // Fetch course details - allow unpublished if admin preview
        const courseQuery = supabase
          .from('courses')
          .select('*')
          .eq('slug', slug)

        if (!isAdminPreview || !userIsAdmin) {
          courseQuery.eq('published', true)
        }

        const { data: courseData, error: courseError } = await courseQuery.single()

        if (courseError) throw courseError
        setCourse(courseData)

        // Fetch sections with lessons
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select(`
            *,
            lessons (*)
          `)
          .eq('courseId', courseData.id)
          .order('orderIndex', { ascending: true })

        if (sectionsError) throw sectionsError

        // Sort lessons within each section and filter published (unless admin preview)
        const sortedSections = sectionsData.map(section => ({
          ...section,
          lessons: section.lessons
            .filter((lesson: any) => lesson.published || (isAdminPreview && userIsAdmin))
            .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
        }))

        setSections(sortedSections)

        // Set first free lesson as current lesson
        const firstFreeLesson = sortedSections
          .flatMap(section => section.lessons)
          .find((lesson: any) => lesson.isFree)

        if (firstFreeLesson) {
          setCurrentLesson(firstFreeLesson)
        }

        // Set user (already fetched above)
        setUser(user)

        if (user) {
          // Check enrollment status
          const { data: enrollmentData } = await supabase
            .from('enrollments')
            .select('*')
            .eq('userId', user.id)
            .eq('cohortId', courseData.id) // This might need adjustment based on your cohort structure
            .single()

          setEnrolled(!!enrollmentData)
        }
      } catch (err) {
        console.error('Error fetching course:', err)
        setError('Course not found or not published')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCourse()
    }
  }, [slug, supabase])

  const canAccessLesson = (lesson: Lesson) => {
    return lesson.isFree || enrolled || (isAdminPreview && isAdmin)
  }

  const totalLessons = sections.reduce((total, section) => total + section.lessons.length, 0)
  const freeLessons = sections.reduce((total, section) => 
    total + section.lessons.filter(lesson => lesson.isFree).length, 0
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || 'The course you are looking for does not exist or is not published.'}</p>
          <Button onClick={() => window.location.href = '/courses'}>
            Browse Courses
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Preview Banner */}
      {isAdminPreview && isAdmin && (
        <div className="bg-orange-100 border-b border-orange-200 px-4 py-2">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-orange-200 text-orange-800">
                  Admin Preview
                </Badge>
                <span className="text-sm text-orange-700">
                  You are viewing this {course?.published ? 'published' : 'draft'} course as an administrator
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.close()}
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold">{course.title}</h1>
            <div className="flex gap-2">
              {isAdminPreview && isAdmin && !course.published && (
                <Badge variant="destructive">Draft</Badge>
              )}
              <Badge variant="outline">{course.level}</Badge>
              <Badge variant="secondary">{course.category}</Badge>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground mb-6">{course.description}</p>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.estimatedHours}h estimated</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{freeLessons} free lessons</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            {currentLesson && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {currentLesson.title}
                      {!currentLesson.isFree && !enrolled && (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </CardTitle>
                    <div className="flex gap-2">
                      {currentLesson.isFree && <Badge variant="secondary">Free</Badge>}
                      <Badge variant="outline">{currentLesson.videoProvider}</Badge>
                    </div>
                  </div>
                  {currentLesson.description && (
                    <CardDescription>{currentLesson.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {canAccessLesson(currentLesson) ? (
                    <div className="space-y-4">
                      {currentLesson.videoId && (
                        <VideoPlayer
                          provider={currentLesson.videoProvider as any}
                          videoId={currentLesson.videoId}
                          embedUrl={currentLesson.embedUrl}
                          thumbnailUrl={currentLesson.thumbnail}
                          title={currentLesson.title}
                          showTitle={false}
                        />
                      )}
                      {currentLesson.content && (
                        <MarkdownRenderer content={currentLesson.content} />
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-semibold mb-2">Premium Content</p>
                        <p className="text-muted-foreground">Enroll in the course to access this lesson</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Course Sections */}
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>{totalLessons} lessons • {freeLessons} free</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sections.map((section, sectionIndex) => (
                  <div key={section.id} className="border rounded-lg">
                    <div className="p-4 bg-muted/50">
                      <h3 className="font-semibold flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                          {sectionIndex + 1}
                        </span>
                        {section.title}
                      </h3>
                    </div>
                    <div className="divide-y">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div 
                          key={lesson.id} 
                          className={`p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors ${
                            currentLesson?.id === lesson.id ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => setCurrentLesson(lesson)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                              {canAccessLesson(lesson) ? (
                                <Play className="h-4 w-4" />
                              ) : (
                                <Lock className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{lesson.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {lesson.description}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.isFree && <Badge variant="secondary" className="text-xs">Free</Badge>}
                            {isAdminPreview && isAdmin && !lesson.published && (
                              <Badge variant="destructive" className="text-xs">Draft</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">{lesson.videoProvider}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user ? (
                  enrolled ? (
                    <div className="text-center">
                      <div className="text-green-600 font-semibold mb-2">✓ Enrolled</div>
                      <p className="text-sm text-muted-foreground">You have access to all course content</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button className="w-full" size="lg">
                        Enroll Now
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Get access to all {totalLessons} lessons
                      </p>
                    </div>
                  )
                ) : (
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => window.location.href = '/auth/signin'}
                    >
                      Sign In to Enroll
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Create an account to access premium content
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What you'll learn</h4>
                  {course.learningGoals ? (
                    <MarkdownRenderer content={course.learningGoals} className="text-sm" />
                  ) : (
                    <p className="text-sm text-muted-foreground">Learning goals not specified</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Prerequisites</h4>
                  {course.prerequisites ? (
                    <MarkdownRenderer content={course.prerequisites} className="text-sm" />
                  ) : (
                    <p className="text-sm text-muted-foreground">No prerequisites required</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
