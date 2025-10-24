'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Youtube, Video } from 'lucide-react'
import { detectVideoProvider, extractVideoInfo, VideoProvider } from '@/lib/video-utils'

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
  videoProvider: VideoProvider
  videoId: string
  embedUrl: string
  thumbnailUrl: string
  content: string
  orderIndex: number
  isFree: boolean
}

export default function CreateCoursePage() {
  const [loading, setLoading] = useState(false)
  const [course, setCourse] = useState({
    title: '',
    slug: '',
    description: '',
    level: '',
    category: '',
    youtubePlaylist: '',
    estimatedHours: '',
    prerequisites: '',
    learningGoals: '',
    published: false,
    featured: false
  })
  const [sections, setSections] = useState<Section[]>([])
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  // Extract video information from URL
  const processVideoUrl = (url: string) => {
    const videoInfo = extractVideoInfo(url)
    return {
      videoProvider: videoInfo?.provider || 'EXTERNAL',
      videoId: videoInfo?.videoId || '',
      embedUrl: videoInfo?.embedUrl || url,
      thumbnailUrl: videoInfo?.thumbnailUrl || ''
    }
  }

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const addSection = () => {
    const newSection: Section = {
      id: `section_${Date.now()}`,
      title: '',
      orderIndex: sections.length,
      lessons: []
    }
    setSections([...sections, newSection])
  }

  const updateSection = (sectionId: string, field: string, value: string) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, [field]: value } : section
    ))
  }

  const removeSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId))
  }

  const addLesson = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section) return

    const newLesson: Lesson = {
      id: `lesson_${Date.now()}`,
      title: '',
      description: '',
      videoUrl: '',
      videoProvider: 'YOUTUBE',
      videoId: '',
      embedUrl: '',
      thumbnailUrl: '',
      content: '',
      orderIndex: section.lessons.length,
      isFree: false
    }

    setSections(sections.map(s => 
      s.id === sectionId 
        ? { ...s, lessons: [...s.lessons, newLesson] }
        : s
    ))
  }

  const updateLesson = (sectionId: string, lessonId: string, field: string, value: string | boolean) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            lessons: section.lessons.map(lesson => 
              lesson.id === lessonId 
                ? { 
                    ...lesson, 
                    [field]: value,
                    ...(field === 'videoUrl' ? processVideoUrl(value as string) : {})
                  }
                : lesson
            )
          }
        : section
    ))
  }

  const removeLesson = (sectionId: string, lessonId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, lessons: section.lessons.filter(lesson => lesson.id !== lessonId) }
        : section
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: course.title,
          slug: course.slug || generateSlug(course.title),
          description: course.description,
          level: course.level,
          category: course.category,
          youtubePlaylist: course.youtubePlaylist,
          estimatedHours: course.estimatedHours ? parseInt(course.estimatedHours) : null,
          prerequisites: course.prerequisites,
          learningGoals: course.learningGoals,
          published: course.published,
          featured: course.featured,
          createdById: user.id
        })
        .select()
        .single()

      if (courseError) throw courseError

      // Create sections and lessons
      for (const section of sections) {
        const { data: sectionData, error: sectionError } = await supabase
          .from('sections')
          .insert({
            courseId: courseData.id,
            title: section.title,
            orderIndex: section.orderIndex
          })
          .select()
          .single()

        if (sectionError) throw sectionError

        // Create lessons for this section
        for (const lesson of section.lessons) {
          const { error: lessonError } = await supabase
            .from('lessons')
            .insert({
              sectionId: sectionData.id,
              title: lesson.title,
              description: lesson.description,
              videoUrl: lesson.videoUrl,
              videoProvider: lesson.videoProvider,
              videoId: lesson.videoId,
              embedUrl: lesson.embedUrl,
              thumbnail: lesson.thumbnailUrl,
              content: lesson.content,
              orderIndex: lesson.orderIndex,
              isFree: lesson.isFree,
              published: true
            })

          if (lessonError) throw lessonError
        }
      }

      router.push('/admin/courses')
    } catch (error) {
      console.error('Error creating course:', error)
      alert('Failed to create course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Course</h1>
        <p className="text-muted-foreground">Create a course from your YouTube videos</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
                <CardDescription>Basic details about your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      value={course.title}
                      onChange={(e) => setCourse({ ...course, title: e.target.value })}
                      placeholder="e.g., Complete React Development"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={course.slug}
                      onChange={(e) => setCourse({ ...course, slug: e.target.value })}
                      placeholder="Auto-generated from title"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={course.description}
                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                    placeholder="Describe what students will learn in this course"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Select value={course.level} onValueChange={(value) => setCourse({ ...course, level: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={course.category} onValueChange={(value) => setCourse({ ...course, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                        <SelectItem value="Backend Development">Backend Development</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="AI/ML">AI/ML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="estimatedHours">Estimated Hours</Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      value={course.estimatedHours}
                      onChange={(e) => setCourse({ ...course, estimatedHours: e.target.value })}
                      placeholder="e.g., 20"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="youtubePlaylist">YouTube Playlist URL (Optional)</Label>
                  <Input
                    id="youtubePlaylist"
                    value={course.youtubePlaylist}
                    onChange={(e) => setCourse({ ...course, youtubePlaylist: e.target.value })}
                    placeholder="https://www.youtube.com/playlist?list=..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>Organize your course into sections and lessons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sections.map((section, sectionIndex) => (
                  <Card key={section.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Input
                            value={section.title}
                            onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                            placeholder={`Section ${sectionIndex + 1} Title`}
                            className="text-lg font-semibold"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSection(section.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Input
                              value={lesson.title}
                              onChange={(e) => updateLesson(section.id, lesson.id, 'title', e.target.value)}
                              placeholder={`Lesson ${lessonIndex + 1} Title`}
                              className="flex-1 mr-2"
                            />
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={lesson.isFree}
                                onCheckedChange={(checked) => updateLesson(section.id, lesson.id, 'isFree', checked)}
                              />
                              <Label className="text-sm">Free</Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLesson(section.id, lesson.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm">Video URL</Label>
                              <div className="relative">
                                {lesson.videoProvider === 'YOUTUBE' ? (
                                  <Youtube className="absolute left-3 top-3 h-4 w-4 text-red-500" />
                                ) : (
                                  <Video className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                                )}
                                <Input
                                  value={lesson.videoUrl}
                                  onChange={(e) => updateLesson(section.id, lesson.id, 'videoUrl', e.target.value)}
                                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/... or any video URL"
                                  className="pl-10"
                                />
                              </div>
                              {lesson.videoId && (
                                <p className="text-xs text-green-600 mt-1">
                                  ✓ {lesson.videoProvider}: {lesson.videoId}
                                </p>
                              )}
                              {lesson.videoUrl && !lesson.videoId && lesson.videoProvider === 'EXTERNAL' && (
                                <p className="text-xs text-blue-600 mt-1">
                                  ✓ External video URL detected
                                </p>
                              )}
                            </div>
                            <div>
                              <Label className="text-sm">Description</Label>
                              <Input
                                value={lesson.description}
                                onChange={(e) => updateLesson(section.id, lesson.id, 'description', e.target.value)}
                                placeholder="Brief lesson description"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm">Lesson Content (Markdown)</Label>
                            <Textarea
                              value={lesson.content}
                              onChange={(e) => updateLesson(section.id, lesson.id, 'content', e.target.value)}
                              placeholder="# Lesson Content&#10;&#10;Write your lesson content in Markdown format..."
                              rows={4}
                            />
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addLesson(section.id)}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Lesson
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addSection}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>Additional course configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="prerequisites">Prerequisites (Markdown)</Label>
                  <Textarea
                    id="prerequisites"
                    value={course.prerequisites}
                    onChange={(e) => setCourse({ ...course, prerequisites: e.target.value })}
                    placeholder="## Prerequisites&#10;&#10;- Basic HTML knowledge&#10;- Familiarity with JavaScript"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="learningGoals">Learning Goals (Markdown)</Label>
                  <Textarea
                    id="learningGoals"
                    value={course.learningGoals}
                    onChange={(e) => setCourse({ ...course, learningGoals: e.target.value })}
                    placeholder="## What You'll Learn&#10;&#10;- Build modern web applications&#10;- Master React concepts"
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="published"
                      checked={course.published}
                      onCheckedChange={(checked) => setCourse({ ...course, published: !!checked })}
                    />
                    <Label htmlFor="published">Publish Course</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={course.featured}
                      onCheckedChange={(checked) => setCourse({ ...course, featured: !!checked })}
                    />
                    <Label htmlFor="featured">Featured Course</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Course'}
          </Button>
        </div>
      </form>
    </div>
  )
}