import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const form = await req.formData()
    const sectionId = String(form.get('sectionId') || '')
    const title = String(form.get('title') || '')
    const videoUrl = String(form.get('videoUrl') || '')
    const description = String(form.get('description') || '')
    const orderIndex = Number(form.get('orderIndex') || 0)

    if (!sectionId || !title) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'INSTRUCTOR')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const lesson = await prisma.lesson.create({ data: { sectionId, title, description, videoUrl: videoUrl || null, orderIndex, published: true } })
    return NextResponse.json({ lesson })
}
