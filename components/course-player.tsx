'use client'

import { useState } from 'react'

type Lesson = {
    id: string
    title: string
    videoUrl?: string | null
}

export default function CoursePlayer({ lesson, courseId }: { lesson: Lesson, courseId: string }) {
    const [loading, setLoading] = useState(false)
    const videoId = lesson.videoUrl ? extractYouTubeId(lesson.videoUrl) : null

    async function markComplete() {
        setLoading(true)
        try {
            await fetch('/api/lesson/complete', {
                method: 'POST',
                body: JSON.stringify({ lessonId: lesson.id }),
                headers: { 'Content-Type': 'application/json' }
            })
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="w-full aspect-video bg-black">
                {videoId ? (
                    <iframe
                        id={`lesson-${lesson.id}`}
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                        title={lesson.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div className="text-white p-4">No video available</div>
                )}
            </div>
            <div className="mt-3 flex items-center gap-3">
                <button onClick={markComplete} disabled={loading} className="rounded bg-primary px-3 py-1 text-white">
                    {loading ? 'Saving...' : 'Mark lesson complete'}
                </button>
            </div>
        </div>
    )
}

function extractYouTubeId(url?: string | null) {
    if (!url) return null
    try {
        const u = new URL(url)
        if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
        if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
    } catch (e) {
        // fallback
        const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
        return m ? m[1] : null
    }
    return null
}
