import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const form = await req.formData()
    const title = String(form.get('title') || '')
    const slug = String(form.get('slug') || '')
    const description = String(form.get('description') || '')
    const videoUrl = String(form.get('videoUrl') || '')

    if (!title || !slug) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    // Check unique slug
    const existing = await prisma.course.findUnique({ where: { slug } })
    if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })

    const course = await prisma.course.create({
        data: {
            title,
            slug,
            description,
            createdById: user.id
        }
    })

    // If video provided, create a default section and lesson
    if (videoUrl) {
        const section = await prisma.section.create({
            data: {
                courseId: course.id,
                title: 'Introduction',
                orderIndex: 0
            }
        })

        await prisma.lesson.create({
            data: {
                sectionId: section.id,
                title: 'Intro Video',
                description: '',
                videoUrl,
                orderIndex: 0,
                published: true
            }
        })
    }

    return NextResponse.json({ course })
}
