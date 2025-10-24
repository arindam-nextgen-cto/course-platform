'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import VideoPlayer from '@/components/video-player'
import MarkdownRenderer from '@/components/markdown-renderer'
import { Clock, Users, BookOpen, Youtube, Edit, Plus } from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  level: string
  category: string
  youtubePlaylist: string
  estimatedHours: number
  prerequisites: string
  learningGoals: string
  published: boolean
  featured: boolean
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

export default function AdminCourseDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [course, setCourse] = useState<Course | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    async function fetchCourse() {
      try {
        // Check authentication
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError('Authentication required')
          return
        }

        // Check user role
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!userData || (userData.role !== 'ADMIN' && userData.role !== 'INSTRUCTOR')) {
          setError('Access denied. Admin or instructor privileges required.')
          return
        }

        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('slug', slug)
          .single()

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

        // Sort lessons within each section
        const sortedSections = sectionsData.map(section => ({
          ...section,
          lessons: section.lessons.sort((a: any, b: any) => a.orderIndex - b.orderIndex)
        }))

        setSections(sortedSections)
      } catch (err) {
        console.error('Error fetching course:', err)
        setError('Failed to load course')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCourse()
    }
  }, [slug, supabase])

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
        <Button onClick={() => window.history.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Course not found</p>
        <Button onClick={() => window.history.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  const totalLessons = sections.reduce((total, section) => total + section.lessons.length, 0)
  const freeLessons = sections.reduce((total, section) => 
    total + section.lessons.filter(lesson => lesson.isFree).length, 0
  )

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <div className="flex gap-2">
              {course.published ? (
                <Badge variant="default">Published</Badge>
              ) : (
                <Badge variant="secondary">Draft</Badge>
              )}
              {course.featured && <Badge variant="destructive">Featured</Badge>}
            </div>
          </div>
          <p className="text-muted-foreground text-lg mb-4">{course.description}</p>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.level}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.estimatedHours}h estimated</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{totalLessons} lessons ({freeLessons} free)</span>
            </div>
            {course.youtubePlaylist && (
              <div className="flex items-center gap-1">
                <Youtube className="h-4 w-4 text-red-500" />
                <a 
                  href={course.youtubePlaylist} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  YouTube Playlist
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => window.location.href = `/admin/courses/${course.slug}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Course
          </Button>
          <Button variant="outline" onClick={() => window.location.href = `/courses/${course.slug}`}>
            View Live
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Course Content</h2>
            <Button onClick={() => window.location.href = `/admin/courses/${course.slug}/sections/new`}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>

          {sections.length > 0 ? (
            sections.map((section, sectionIndex) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      {sectionIndex + 1}
                    </span>
                    {section.title}
                  </CardTitle>
                  <CardDescription>
                    {section.lessons.length} lesson{section.lessons.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <Card key={lesson.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {sectionIndex + 1}.{lessonIndex + 1}
                            </span>
                            {lesson.title}
                          </CardTitle>
                          <div className="flex gap-2">
                            {lesson.isFree && <Badge variant="secondary">Free</Badge>}
                            {lesson.videoId && (
                              <Badge variant="outline" className="text-blue-600">
                                <Youtube className="h-3 w-3 mr-1" />
                                {lesson.videoProvider}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {lesson.description && (
                          <CardDescription>{lesson.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {lesson.videoId && (
                          <VideoPlayer
                            provider={lesson.videoProvider as any}
                            videoId={lesson.videoId}
                            embedUrl={lesson.embedUrl}
                            thumbnailUrl={lesson.thumbnail}
                            title={lesson.title}
                            showTitle={false}
                          />
                        )}
                        {lesson.content && (
                          <MarkdownRenderer content={lesson.content} />
                        )}
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `/admin/courses/${course.slug}/lessons/${lesson.id}/edit`}
                          >
                            Edit Lesson
                          </Button>
                          {lesson.videoUrl && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(lesson.videoUrl, '_blank')}
                            >
                              Watch Original
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = `/admin/courses/${course.slug}/sections/${section.id}/lessons/new`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lesson to {section.title}
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No content added yet</p>
                <Button 
                  className="mt-4"
                  onClick={() => window.location.href = `/admin/courses/${course.slug}/sections/new`}
                >
                  Create Your First Section
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                {course.prerequisites ? (
                  <MarkdownRenderer content={course.prerequisites} />
                ) : (
                  <p className="text-muted-foreground">No prerequisites specified</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Goals</CardTitle>
              </CardHeader>
              <CardContent>
                {course.learningGoals ? (
                  <MarkdownRenderer content={course.learningGoals} />
                ) : (
                  <p className="text-muted-foreground">No learning goals specified</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Course Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{sections.length}</div>
                  <div className="text-sm text-muted-foreground">Sections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalLessons}</div>
                  <div className="text-sm text-muted-foreground">Total Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{freeLessons}</div>
                  <div className="text-sm text-muted-foreground">Free Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{course.estimatedHours}h</div>
                  <div className="text-sm text-muted-foreground">Estimated Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Cohorts</h2>
            <Button onClick={() => window.location.href = `/admin/courses/${course.slug}/cohorts/new`}>
              <Plus className="h-4 w-4 mr-2" />
              Create Cohort
            </Button>
          </div>

          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Cohort management coming soon</p>
              <p className="text-sm text-muted-foreground mt-2">
                This will show all cohorts for this course with enrollment management
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}