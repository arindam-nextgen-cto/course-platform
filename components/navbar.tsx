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
  const [isScrolled, setIsScrolled] = useState(false)
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

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 6)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  const headerClass = isScrolled
    ? 'sticky top-0 z-50 bg-black/95 border-b border-gray-800 shadow-lg transition-all duration-200'
    : 'sticky top-0 z-50 bg-[#05060a] border-b border-gray-900 transition-all duration-200'

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center relative">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <h1 className="text-xl font-bold text-white">NextGen-CTO</h1>
          </Link>
          {/* Trusted pill */}
          <div className="hidden md:flex items-center">
            <div className="trusted-pill text-xs text-gray-300">Trusted by <strong className="ml-1">1.5M+</strong></div>
          </div>
        </div>

        {/* Navigation (centered on wide screens) */}
        <nav className="hidden md:flex absolute inset-x-0 h-full items-center justify-center space-x-10">
          <Link href="/courses" className="nav-link">
            Courses
          </Link>
          {session && (
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
          )}
          <Link href="/about" className="nav-link">
            About
          </Link>
          <Link href="/pricing" className="nav-link">
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
                <Button className="bg-gradient-to-r from-orange-400 to-red-600 text-white font-medium shadow-md hover:shadow-lg transform-gpu transition-shadow duration-200">
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