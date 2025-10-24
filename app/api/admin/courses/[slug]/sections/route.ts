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
      where: { slug: params.slug }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if user has permission to edit this course
    if (user.role !== 'ADMIN' && course.createdById !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { title } = await req.json()

    // Get the next order index
    const sections = await prisma.section.findMany({
      where: { courseId: course.id },
      orderBy: { orderIndex: 'asc' }
    })

    const orderIndex = sections.length > 0 
      ? Math.max(...sections.map(s => s.orderIndex)) + 1 
      : 0

    const section = await prisma.section.create({
      data: {
        courseId: course.id,
        title,
        orderIndex
      }
    })

    return NextResponse.json({ section })
  } catch (error) {
    console.error('Error creating section:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}