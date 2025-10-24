'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EditLessonPage({ params }: { params: { slug: string, lessonId: string } }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`/api/admin/courses/${params.slug}/lessons/${params.lessonId}`)
        const data = await response.json()
        
        if (data.error) {
          setError(data.error)
          return
        }

        setTitle(data.lesson.title)
        setDescription(data.lesson.description || '')
        setVideoUrl(data.lesson.videoUrl || '')
        setPublished(data.lesson.published)
      } catch (err) {
        setError('Failed to load lesson')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [params.slug, params.lessonId])

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Edit Lesson</h1>
          <button 
            onClick={() => router.back()}
            className="rounded bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90 transition-colors"
          >
            Back
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Lesson Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded-lg bg-background"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Video URL</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full p-3 border rounded-lg bg-background"
                placeholder="https://youtube.com/watch?v=..."
              />
              <p className="mt-1 text-sm text-muted-foreground">
                YouTube, Vimeo, or other video URLs
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Published
              </label>
              <p className="ml-2 text-sm text-muted-foreground">
                Unpublished lessons are not visible to students
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded bg-primary px-6 py-3 text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded bg-secondary px-6 py-3 text-secondary-foreground hover:bg-secondary/90 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}