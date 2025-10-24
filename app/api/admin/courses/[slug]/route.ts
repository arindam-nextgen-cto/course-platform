import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-sync'

export async function GET(req: Request, { params }: { params: { slug: string } }) {
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

    return NextResponse.json({ course })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
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

    const { title, slug: newSlug, description } = await req.json()

    // Check if new slug is already taken (and it's not the current course)
    if (newSlug !== course.slug) {
      const existing = await prisma.course.findUnique({
        where: { slug: newSlug }
      })
      
      if (existing) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
      }
    }

    const updatedCourse = await prisma.course.update({
      where: { id: course.id },
      data: {
        title,
        slug: newSlug,
        description
      }
    })

    return NextResponse.json({ course: updatedCourse })
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
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

    // Check if user has permission to delete this course
    if (user.role !== 'ADMIN' && course.createdById !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete the course (cascade will handle sections and lessons)
    await prisma.course.delete({
      where: { id: course.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}