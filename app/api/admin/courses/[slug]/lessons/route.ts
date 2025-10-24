import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-sync'

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    const user = await getCurrentUser()
    
    if (!user || (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const course = await prisma.course.findUnique({
      where: { slug: params.slug },
      include: { sections: true }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if user has permission to edit this course
    if (user.role !== 'ADMIN' && course.createdById !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { title, description, videoUrl, sectionId } = await req.json()

    // Validate section belongs to this course
    const section = await prisma.section.findUnique({
      where: { id: sectionId }
    })

    if (!section || section.courseId !== course.id) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
    }

    // Get the next order index for this section
    const lessons = await prisma.lesson.findMany({
      where: { sectionId: section.id },
      orderBy: { orderIndex: 'asc' }
    })

    const orderIndex = lessons.length > 0 
      ? Math.max(...lessons.map(l => l.orderIndex)) + 1 
      : 0

    const lesson = await prisma.lesson.create({
      data: {
        sectionId: section.id,
        title,
        description,
        videoUrl,
        orderIndex,
        published: false
      }
    })

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}