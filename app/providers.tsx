"use client"

import React, { useEffect, useState } from "react"

function LocalThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
      const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const initial = stored ?? (prefersDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', initial === 'dark')
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const onChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('theme')
      if (!stored) {
        document.documentElement.classList.toggle('dark', e.matches)
      }
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [mounted])

  return <>{children}</>
}

export default LocalThemeProvider
