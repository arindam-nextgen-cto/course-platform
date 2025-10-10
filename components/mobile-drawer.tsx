"use client"

import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Session } from '@supabase/supabase-js'

export default function MobileDrawer({
  session,
  loading,
  onSignOut,
  currentPathname,
}: {
  session: Session | null
  loading: boolean
  onSignOut: () => Promise<void>
  currentPathname?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const prev = typeof document !== 'undefined' ? document.body.style.overflow : ''
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : prev
      document.documentElement.classList.toggle('mobile-drawer-open', isOpen)
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = prev
        document.documentElement.classList.remove('mobile-drawer-open')
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!currentPathname) return
    setIsOpen(false)
  }, [currentPathname])

  return (
    <>
      <div className="flex items-center space-x-3">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(s => !s)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className={`md:hidden p-2 rounded-md hover:bg-white/3 transition-colors mobile-hamburger`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="mobile-drawer"
            className={`mobile-drawer md:hidden open`}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
          >
            <motion.div
              className="mobile-drawer-backdrop"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />

            <motion.aside
              className="mobile-drawer-panel px-6 py-8"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <div className="text-white font-semibold">NextGen-CTO</div>
                </div>
                <button onClick={() => setIsOpen(false)} aria-label="Close menu" className="p-2 rounded-md hover:bg-white/4 close-drawer-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col gap-3">
                <Link href="/courses" className="nav-link" onClick={() => setIsOpen(false)}>
                  Courses
                </Link>
                <Link href="/about" className="nav-link" onClick={() => setIsOpen(false)}>
                  About
                </Link>
                <Link href="/pricing" className="nav-link" onClick={() => setIsOpen(false)}>
                  Pricing
                </Link>

                {session ? (
                  <>
                    <Link href="/dashboard" className="nav-link" onClick={() => setIsOpen(false)}>Dashboard</Link>
                    <Link href="/profile" className="nav-link" onClick={() => setIsOpen(false)}>Profile</Link>
                    <button className="nav-link text-left" onClick={() => { setIsOpen(false); onSignOut(); }}>{loading ? 'Signing out...' : 'Sign out'}</button>
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
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

 
