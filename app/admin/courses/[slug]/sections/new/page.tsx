'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewSectionPage({ params }: { params: { slug: string } }) {
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/courses/${params.slug}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title })
      })

      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        return
      }

      router.push(`/admin/courses/${params.slug}`)
      router.refresh()
    } catch (err) {
      setError('Failed to create section')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Create New Section</h1>
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
              <label className="block text-sm font-medium mb-2">Section Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded-lg bg-background"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded bg-primary px-6 py-3 text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Section'}
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