import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-sync'

// GET method to fetch a specific lesson
export async function GET(req: Request, { params }: { params: { slug: string, lessonId: string } }) {
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

    // Check if user has permission to access this course
    if (user.role !== 'ADMIN' && course.createdById !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Find the lesson and verify it belongs to this course
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
      include: { 
        section: true 
      }
    })

    if (!lesson || lesson.section.courseId !== course.id) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { slug: string, lessonId: string } }) {
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

    const { title, description, videoUrl, published } = await req.json()

    // Find the lesson and verify it belongs to this course
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
      include: { section: true }
    })

    if (!lesson || lesson.section.courseId !== course.id) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: params.lessonId },
      data: {
        title,
        description,
        videoUrl,
        published
      }
    })

    return NextResponse.json({ lesson: updatedLesson })
  } catch (error) {
    console.error('Error updating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string, lessonId: string } }) {
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

    // Find the lesson and verify it belongs to this course
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
      include: { section: true }
    })

    if (!lesson || lesson.section.courseId !== course.id) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    await prisma.lesson.delete({
      where: { id: params.lessonId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}