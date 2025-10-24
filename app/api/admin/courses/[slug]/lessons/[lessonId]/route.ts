import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET method to fetch a specific lesson
export async function GET(req: Request, { params }: { params: { slug: string, lessonId: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || (userData.role !== 'ADMIN' && userData.role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if user has permission to access this course
    if (userData.role !== 'ADMIN' && course.createdById !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get lesson with section info
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        *,
        section:sections(*)
      `)
      .eq('id', params.lessonId)
      .single()

    if (lessonError || !lesson || lesson.section.courseId !== course.id) {
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
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || (userData.role !== 'ADMIN' && userData.role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if user has permission to edit this course
    if (userData.role !== 'ADMIN' && course.createdById !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { 
      title, 
      description, 
      videoUrl, 
      videoProvider, 
      videoId, 
      embedUrl, 
      thumbnail, 
      content, 
      isFree, 
      published 
    } = await req.json()

    // Get lesson with section info to verify it belongs to this course
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        *,
        section:sections(courseId)
      `)
      .eq('id', params.lessonId)
      .single()

    if (lessonError || !lesson || lesson.section.courseId !== course.id) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Update the lesson
    const { data: updatedLesson, error: updateError } = await supabase
      .from('lessons')
      .update({
        title,
        description,
        videoUrl,
        videoProvider,
        videoId,
        embedUrl,
        thumbnail,
        content,
        isFree,
        published
      })
      .eq('id', params.lessonId)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ lesson: updatedLesson })
  } catch (error) {
    console.error('Error updating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string, lessonId: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || (userData.role !== 'ADMIN' && userData.role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if user has permission to edit this course
    if (userData.role !== 'ADMIN' && course.createdById !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get lesson with section info to verify it belongs to this course
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        *,
        section:sections(courseId)
      `)
      .eq('id', params.lessonId)
      .single()

    if (lessonError || !lesson || lesson.section.courseId !== course.id) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Delete the lesson
    const { error: deleteError } = await supabase
      .from('lessons')
      .delete()
      .eq('id', params.lessonId)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}