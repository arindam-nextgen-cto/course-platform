'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase'

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Don't run auth check for signin page
        if (pathname === '/admin/signin') {
            setLoading(false)
            return
        }
        const checkAuth = async () => {
            try {
                // Check if user is authenticated with Supabase
                const supabase = createClientSupabaseClient()
                const { data: { user: supabaseUser } } = await supabase.auth.getUser()

                if (!supabaseUser) {
                    router.push('/admin/signin')
                    return
                }

                // Get user role from database
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id, email, name, role')
                    .eq('id', supabaseUser.id)
                    .single()

                if (userError || !userData) {
                    router.push('/admin/signin')
                    return
                }

                if (userData.role !== 'ADMIN' && userData.role !== 'INSTRUCTOR') {
                    router.push('/unauthorized')
                    return
                }

                setUser(userData)
            } catch (error) {
                console.error('Auth error:', error)
                router.push('/admin/signin')
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [router, pathname])

    // Don't apply admin layout to signin page
    if (pathname === '/admin/signin') {
        return <>{children}</>
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4">Loading admin panel...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">N</span>
                        </div>
                        <h1 className="text-xl font-bold text-foreground">NextGen-CTO</h1>
                        <div className="text-sm text-muted-foreground">Admin Panel</div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm">
                            {user?.name || user?.email}
                        </span>
                        <button
                            onClick={async () => {
                                const supabase = createClientSupabaseClient()
                                await supabase.auth.signOut()
                                router.push('/admin/signin')
                            }}
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-5 gap-6">
                <nav className="col-span-1 p-4 border rounded">
                    <h2 className="font-semibold mb-4">Navigation</h2>
                    <ul className="space-y-2">
                        <li><Link href="/admin" className="hover:underline">Dashboard</Link></li>
                        <li><Link href="/admin/courses" className="hover:underline">Courses</Link></li>
                        <li><Link href="/admin/users" className="hover:underline">Users</Link></li>
                        <li><Link href="/admin/settings" className="hover:underline">Settings</Link></li>
                    </ul>

                    {user?.role === 'ADMIN' && (
                        <>
                            <h2 className="font-semibold mt-6 mb-4">Admin</h2>
                            <ul className="space-y-2">
                                <li><Link href="/admin/system" className="hover:underline">System</Link></li>
                            </ul>
                        </>
                    )}
                </nav>
                <main className="col-span-1 md:col-span-4">{children}</main>
            </div>
        </div>
    )
}