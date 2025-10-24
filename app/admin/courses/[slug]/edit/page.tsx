'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase'

export default function EditCoursePage({ params }: { params: { slug: string } }) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const supabase = createClientSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/admin-signin')
          return
        }

        // Fetch course data
        const response = await fetch(`/api/admin/courses/${params.slug}`)
        const data = await response.json()
        
        if (data.error) {
          setError(data.error)
          return
        }

        setTitle(data.course.title)
        setSlug(data.course.slug)
        setDescription(data.course.description || '')
      } catch (err) {
        setError('Failed to load course')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [params.slug, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/courses/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug,
          description
        })
      })

      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        return
      }

      router.push(`/admin/courses/${data.course.slug}`)
      router.refresh()
    } catch (err) {
      setError('Failed to update course')
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
          <p className="mt-4">Loading course...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Edit Course</h1>
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
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded-lg bg-background"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-3 border rounded-lg bg-background"
                required
              />
              <p className="mt-1 text-sm text-muted-foreground">
                This will be used in the course URL. Use lowercase letters, numbers, and hyphens only.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-3 border rounded-lg bg-background"
              />
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