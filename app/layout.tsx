import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { headers } from 'next/headers'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NextGen-CTO - Learn Tech Skills Through Cohorts',
  description: 'A cohort-based learning platform for aspiring developers and tech professionals',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Obtain session on the server so the navbar can render authenticated state on first load
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Try to detect the current request pathname so we can suppress the navbar
  // Try to detect the current request pathname so we can suppress the navbar
  // on auth routes (so sign-in/up pages don't show the app navbar). Next.js
  // doesn't provide a single guaranteed header name across runtimes, so try
  // a few common header names and fall back to empty string.
  const hdrs = headers()
  const pathname =
    hdrs.get('x-invoke-path') || hdrs.get('x-invoke-pathname') || hdrs.get('x-nextjs-pathname') || ''
  const isAuthRoute = pathname.startsWith('/auth')

  return (
    <html lang="en">
      <body className={inter.className}>
        {!isAuthRoute ? <Navbar initialSession={session} /> : null}
        {children}
        {!isAuthRoute ? <Footer /> : null}
      </body>
    </html>
  )
}