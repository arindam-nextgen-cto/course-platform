'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import AdminNavbar from '@/components/admin-navbar'
import AdminFooter from '@/components/admin-footer'
import { Session } from '@supabase/auth-helpers-nextjs'

interface ConditionalLayoutProps {
  children: React.ReactNode
  session: Session | null
}

export default function ConditionalLayout({ children, session }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Use admin layout for admin routes (except signin)
  const isAdminRoute = pathname?.startsWith('/admin') && pathname !== '/admin/signin'
  
  if (isAdminRoute) {
    return (
      <>
        <AdminNavbar initialSession={session} />
        {children}
        <AdminFooter />
      </>
    )
  }
  
  // No layout for admin signin page (similar to auth pages)
  if (pathname === '/admin/signin') {
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