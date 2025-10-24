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
            <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-5 gap-6">
                <nav className="col-span-1">
                    <div className="sticky top-20 p-4 border rounded-lg bg-card">
                        <h2 className="font-semibold mb-4 text-foreground">Navigation</h2>
                        <ul className="space-y-2">
                            <li>
                                <Link 
                                    href="/admin" 
                                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                        pathname === '/admin' 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/admin/courses" 
                                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                        pathname?.startsWith('/admin/courses') 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                    }`}
                                >
                                    Courses
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/admin/users" 
                                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                        pathname?.startsWith('/admin/users') 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                    }`}
                                >
                                    Users
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/admin/settings" 
                                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                        pathname?.startsWith('/admin/settings') 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                    }`}
                                >
                                    Settings
                                </Link>
                            </li>
                        </ul>

                        {user?.role === 'ADMIN' && (
                            <>
                                <h2 className="font-semibold mt-6 mb-4 text-foreground">Admin Only</h2>
                                <ul className="space-y-2">
                                    <li>
                                        <Link 
                                            href="/admin/system" 
                                            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                                pathname === '/admin/system' 
                                                    ? 'bg-primary text-primary-foreground' 
                                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                            }`}
                                        >
                                            System
                                        </Link>
                                    </li>
                                </ul>
                            </>
                        )}
                    </div>
                </nav>
                <main className="col-span-1 md:col-span-4">{children}</main>
            </div>
        </div>
    )
}