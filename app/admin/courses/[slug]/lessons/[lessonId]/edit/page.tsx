'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import VideoPlayer from '@/components/video-player'
import MarkdownRenderer from '@/components/markdown-renderer'
import { extractVideoInfo, VideoProvider } from '@/lib/video-utils'
import { Youtube, Video, Eye } from 'lucide-react'

export default function EditLessonPage({ params }: { params: { slug: string, lessonId: string } }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoProvider, setVideoProvider] = useState<VideoProvider>('YOUTUBE')
  const [videoId, setVideoId] = useState('')
  const [embedUrl, setEmbedUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [content, setContent] = useState('')
  const [isFree, setIsFree] = useState(false)
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()

  // Process video URL when it changes
  const processVideoUrl = (url: string) => {
    if (!url) {
      setVideoProvider('YOUTUBE')
      setVideoId('')
      setEmbedUrl('')
      setThumbnailUrl('')
      return
    }

    const videoInfo = extractVideoInfo(url)
    if (videoInfo) {
      setVideoProvider(videoInfo.provider)
      setVideoId(videoInfo.videoId)
      setEmbedUrl(videoInfo.embedUrl)
      setThumbnailUrl(videoInfo.thumbnailUrl)
    } else {
      setVideoProvider('EXTERNAL')
      setVideoId('')
      setEmbedUrl(url)
      setThumbnailUrl('')
    }
  }

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`/api/admin/courses/${params.slug}/lessons/${params.lessonId}`)
        const data = await response.json()
        
        if (data.error) {
          setError(data.error)
          return
        }

        const lesson = data.lesson
        setTitle(lesson.title)
        setDescription(lesson.description || '')
        setVideoUrl(lesson.videoUrl || '')
        setVideoProvider(lesson.videoProvider || 'YOUTUBE')
        setVideoId(lesson.videoId || '')
        setEmbedUrl(lesson.embedUrl || '')
        setThumbnailUrl(lesson.thumbnail || '')
        setContent(lesson.content || '')
        setIsFree(lesson.isFree || false)
        setPublished(lesson.published)
      } catch (err) {
        setError('Failed to load lesson')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [params.slug, params.lessonId])

  // Update video info when URL changes
  useEffect(() => {
    processVideoUrl(videoUrl)
  }, [videoUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/courses/${params.slug}/lessons/${params.lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          videoUrl,
          videoProvider,
          videoId,
          embedUrl,
          thumbnail: thumbnailUrl,
          content,
          isFree,
          published
        })
      })

      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        return
      }

      router.push(`/admin/courses/${params.slug}`)
      router.refresh()
    } catch (err) {
      setError('Failed to update lesson')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading lesson...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Lesson</h1>
          <p className="text-muted-foreground">Update lesson content and settings</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Edit Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Details</CardTitle>
              <CardDescription>Basic information about the lesson</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Lesson Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Introduction to React Hooks"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of what students will learn"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video Content</CardTitle>
              <CardDescription>Add video from any supported platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="videoUrl">Video URL</Label>
                <div className="relative">
                  {videoProvider === 'YOUTUBE' ? (
                    <Youtube className="absolute left-3 top-3 h-4 w-4 text-red-500" />
                  ) : (
                    <Video className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                  )}
                  <Input
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/... or any video URL"
                    className="pl-10"
                  />
                </div>
                {videoId && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{videoProvider}</Badge>
                    <span className="text-xs text-green-600">✓ Video ID: {videoId}</span>
                  </div>
                )}
                {videoUrl && !videoId && videoProvider === 'EXTERNAL' && (
                  <p className="text-xs text-blue-600 mt-2">
                    ✓ External video URL detected
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
              <CardDescription>Additional content in Markdown format</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="content">Content (Markdown)</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="# Lesson Content&#10;&#10;Write your lesson content in Markdown format..."
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Lesson visibility and access settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFree"
                  checked={isFree}
                  onCheckedChange={(checked) => setIsFree(!!checked)}
                />
                <Label htmlFor="isFree">Free Lesson</Label>
                <span className="text-sm text-muted-foreground">
                  Allow non-enrolled users to access this lesson
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={published}
                  onCheckedChange={(checked) => setPublished(!!checked)}
                />
                <Label htmlFor="published">Published</Label>
                <span className="text-sm text-muted-foreground">
                  Make this lesson visible to students
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              onClick={handleSubmit} 
              disabled={saving}
              className="flex-1"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How this lesson will appear to students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{title || 'Lesson Title'}</h3>
                    {isFree && <Badge variant="secondary">Free</Badge>}
                    {videoProvider && <Badge variant="outline">{videoProvider}</Badge>}
                  </div>
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                </div>

                {videoId && (
                  <VideoPlayer
                    provider={videoProvider}
                    videoId={videoId}
                    embedUrl={embedUrl}
                    thumbnailUrl={thumbnailUrl}
                    title={title}
                    showTitle={false}
                  />
                )}

                {content && (
                  <div>
                    <h4 className="font-semibold mb-2">Lesson Content</h4>
                    <MarkdownRenderer content={content} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}