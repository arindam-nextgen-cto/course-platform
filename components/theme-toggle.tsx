"use client"

import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('theme')
      if (stored) {
        setIsDark(stored === 'dark')
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDark(true)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      document.documentElement.classList.toggle('dark', isDark)
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    } catch (e) {
      // ignore
    }
  }, [isDark, mounted])

  if (!mounted) return null

  return (
    <button
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setIsDark(s => !s)}
      className="p-2 rounded-md hover:bg-accent/8 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] transition-colors"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
