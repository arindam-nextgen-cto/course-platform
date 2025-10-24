'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, Settings, User } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'
import ThemeToggle from './theme-toggle'

export default function AdminNavbar({ initialSession }: { initialSession: Session | null }) {
    const [session, setSession] = useState<Session | null>(initialSession)
    const [loading, setLoading] = useState(false)
    const supabase = createClientSupabaseClient()
    const router = useRouter()

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session as Session | null)
        })

        return () => {
            subscription?.unsubscribe()
        }
    }, [supabase])

    const handleSignOut = async () => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            router.push('/')
        } catch (err) {
            console.error('Error signing out:', err)
            router.push('/')
        } finally {
            setLoading(false)
        }
    }

    const getUserInitials = (name?: string, email?: string) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        }
        if (email) {
            return email.slice(0, 2).toUpperCase()
        }
        return 'U'
    }

    return (
        <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-4">
                    <Link href="/admin" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">N</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold text-foreground">NextGen-CTO</h1>
                            <span className="text-xs text-muted-foreground">Admin Panel</span>
                        </div>
                    </Link>
                    <Link 
                        href="/" 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md px-3 py-1"
                    >
                        ← Back to Site
                    </Link>
                </div>

                {/* User Actions */}
                <div className="flex items-center space-x-3">
                    <ThemeToggle />
                    {session && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="relative h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={session.user.user_metadata?.avatar_url}
                                            alt={session.user.user_metadata?.full_name || session.user.email || 'User'}
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] text-primary-foreground">
                                            {getUserInitials(
                                                session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                                                session.user.email
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-popover border-border" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none text-foreground">
                                            {session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Admin'}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem asChild className="text-muted-foreground hover:text-foreground hover:bg-accent/6">
                                    <Link href="/profile" className="flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="text-muted-foreground hover:text-foreground hover:bg-accent/6">
                                    <Link href="/settings" className="flex items-center">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem asChild className="text-muted-foreground hover:text-foreground hover:bg-accent/6">
                                    <Link href="/" className="flex items-center">
                                        <span>← Back to Site</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem
                                    className="text-muted-foreground hover:text-foreground hover:bg-accent/6 cursor-pointer"
                                    onClick={handleSignOut}
                                    disabled={loading}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>{loading ? 'Signing out...' : 'Sign out'}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    )
}