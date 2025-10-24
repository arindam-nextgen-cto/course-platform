import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    
    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    // Get user from database to check role
    const user = await prisma.user.findUnique({
      where: { id: data.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}