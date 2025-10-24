import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
    // Use the server Supabase client to sign out which will clear Supabase auth cookies
    const supabase = createServerSupabaseClient()
    await supabase.auth.signOut()

    const res = NextResponse.redirect(new URL('/admin-signin', req.url))
    return res
}
