import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function NewCoursePage() {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/signin')

    // Simple form using server action? We'll render a minimal client-side form that posts to API route.
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-4">Create new course</h1>
            <form action="/api/admin/create-course" method="post" className="space-y-4 max-w-lg">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input name="title" required className="mt-1 block w-full" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Slug</label>
                    <input name="slug" required className="mt-1 block w-full" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea name="description" className="mt-1 block w-full" />
                </div>
                <div>
                    <label className="block text-sm font-medium">YouTube Video URL (first lesson)</label>
                    <input name="videoUrl" className="mt-1 block w-full" />
                </div>
                <div>
                    <button type="submit" className="rounded bg-primary px-4 py-2 text-white">Create</button>
                </div>
            </form>
        </div>
    )
}
