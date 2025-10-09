import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && session?.user) {
      // Create or update user in our database
      try {
        await prisma.user.upsert({
          where: { email: session.user.email! },
          update: {
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            avatar: session.user.user_metadata?.avatar_url,
          },
          create: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            avatar: session.user.user_metadata?.avatar_url,
            role: 'STUDENT', // Default role
          },
        })
      } catch (dbError) {
        console.error('Database error:', dbError)
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', request.url))
}