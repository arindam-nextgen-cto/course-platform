'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Settings, LogOut, BookOpen, BarChart3 } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'

export default function Navbar({ initialSession }: { initialSession: Session | null }) {
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
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <h1 className="text-xl font-bold text-white">NextGen-CTO</h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/courses" className="text-gray-300 hover:text-white font-medium transition-colors">
            Courses
          </Link>
          {session && (
            <Link href="/dashboard" className="text-gray-300 hover:text-white font-medium transition-colors">
              Dashboard
            </Link>
          )}
          <Link href="/about" className="text-gray-300 hover:text-white font-medium transition-colors">
            About
          </Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white font-medium transition-colors">
            Pricing
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={session.user.user_metadata?.avatar_url} 
                      alt={session.user.user_metadata?.full_name || session.user.email || 'User'} 
                    />
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
                      {getUserInitials(
                        session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                        session.user.email
                      )}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-gray-400">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <Link href="/dashboard" className="flex items-center">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <Link href="/courses" className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>My Courses</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                  onClick={handleSignOut}
                  disabled={loading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{loading ? 'Signing out...' : 'Sign out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" className="font-medium text-white hover:bg-gray-800">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 font-medium">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}