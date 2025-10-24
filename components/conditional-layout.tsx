'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Session } from '@supabase/auth-helpers-nextjs'

interface ConditionalLayoutProps {
  children: React.ReactNode
  session: Session | null
}

export default function ConditionalLayout({ children, session }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Don't show main navbar and footer for admin routes
  const isAdminRoute = pathname?.startsWith('/admin')
  
  if (isAdminRoute) {
    return <>{children}</>
  }
  
  return (
    <>
      <Navbar initialSession={session} />
      {children}
      <Footer />
    </>
  )
}