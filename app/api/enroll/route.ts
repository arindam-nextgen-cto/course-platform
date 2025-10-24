import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const form = await req.formData()
    const courseId = String(form.get('courseId') || '')

    if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 })

    // Choose first OPEN cohort for course or create a default cohort if none
    let cohort = await prisma.cohort.findFirst({ where: { courseId, status: 'OPEN' } })
    if (!cohort) {
        cohort = await prisma.cohort.create({ data: { courseId, name: 'Self-paced', status: 'OPEN', createdById: user.id } })
    }

    const enrollment = await prisma.enrollment.upsert({
        where: { userId_cohortId: { userId: user.id, cohortId: cohort.id } },
        update: { status: 'ENROLLED' },
        create: { userId: user.id, cohortId: cohort.id }
    })

    return NextResponse.json({ enrollment })
}
