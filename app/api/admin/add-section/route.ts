import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const form = await req.formData()
    const courseId = String(form.get('courseId') || '')
    const title = String(form.get('title') || '')
    const orderIndex = Number(form.get('orderIndex') || 0)

    if (!courseId || !title) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    // Verify role from Prisma
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'INSTRUCTOR')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const section = await prisma.section.create({ data: { courseId, title, orderIndex } })
    return NextResponse.json({ section })
}
