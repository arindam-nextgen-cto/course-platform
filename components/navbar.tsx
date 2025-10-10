'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClientSupabaseClient } from '@/lib/supabase'
import SignOutButton from '@/components/signout-button'
import { Button } from '@/components/ui/button'
import type { Session } from '@supabase/supabase-js'

export default function Navbar({ initialSession }: { initialSession: Session | null }) {
  const [session, setSession] = useState<Session | null>(initialSession)
  const supabase = createClientSupabaseClient()

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

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <h1 className="text-xl font-bold text-white">NextGen-CTO</h1>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/courses" className="text-gray-300 hover:text-white font-medium transition-colors">Courses</Link>
          <Link href="/about" className="text-gray-300 hover:text-white font-medium transition-colors">About</Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white font-medium transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center space-x-3">
          {session ? (
            <>
              <span className="text-gray-300 mr-2 text-sm">{session.user?.email}</span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" className="font-medium text-white hover:bg-gray-800">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 font-medium">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}