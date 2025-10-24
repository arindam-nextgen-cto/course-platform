import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const lessonId = body.lessonId
    if (!lessonId) return NextResponse.json({ error: 'Missing lessonId' }, { status: 400 })

    const progress = await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId: user.id, lessonId } },
        update: { status: 'COMPLETED', completedAt: new Date() },
        create: { userId: user.id, lessonId, status: 'COMPLETED', completedAt: new Date() }
    })

    return NextResponse.json({ progress })
}
