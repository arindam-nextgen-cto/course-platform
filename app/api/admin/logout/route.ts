import { NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME } from '@/lib/admin-config'

export async function POST(req: Request) {
    const res = NextResponse.redirect(new URL('/admin-signin', req.url))
    res.cookies.set({ name: ADMIN_COOKIE_NAME, value: '', path: '/', maxAge: 0 })
    return res
}
