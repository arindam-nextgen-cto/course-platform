'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

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

  // close the mobile menu when the route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (typeof document === 'undefined') return
    const prev = document.body.style.overflow
    document.body.style.overflow = isOpen ? 'hidden' : prev
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

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
          {/* Mobile menu toggle (visible on small screens) */}
          <button
            onClick={() => setIsOpen(s => !s)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden p-2 rounded-md hover:bg-white/3 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
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
              <Link href="/auth/signin" className="hidden md:inline-flex">
                <Button variant="ghost" className="font-medium text-white hover:bg-gray-800">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" className="hidden md:inline-flex">
                <Button className="bg-gradient-to-r from-orange-400 to-red-600 text-white font-medium shadow-md hover:shadow-lg transform-gpu transition-shadow duration-200">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      {/* Mobile nav overlay */}
      {/* Mobile drawer (animated) */}
      <div
        className={`mobile-drawer md:hidden ${isOpen ? 'open' : 'closed'}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        <div className="mobile-drawer-backdrop" onClick={() => setIsOpen(false)} />
        <div className="mobile-drawer-panel px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <div className="text-white font-semibold">NextGen-CTO</div>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close menu" className="p-2 rounded-md hover:bg-white/4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-3">
            <Link href="/courses" className="nav-link" aria-current={isActive('/courses') ? 'page' : undefined} onClick={() => setIsOpen(false)}>
              Courses
            </Link>
            <Link href="/about" className="nav-link" aria-current={isActive('/about') ? 'page' : undefined} onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link href="/pricing" className="nav-link" aria-current={isActive('/pricing') ? 'page' : undefined} onClick={() => setIsOpen(false)}>
              Pricing
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="nav-link" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Link href="/profile" className="nav-link" onClick={() => setIsOpen(false)}>Profile</Link>
                <button className="nav-link text-left" onClick={handleSignOut}>Sign out</button>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-4">
                <Link href="/auth/signin" className="nav-link" onClick={() => setIsOpen(false)}>Sign In</Link>
                <Link href="/auth/signup" className="inline-block" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-orange-400 to-red-600 text-white">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}