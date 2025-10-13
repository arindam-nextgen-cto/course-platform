import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './globals.css'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { createServerSupabaseClient } from '@/lib/supabase-server'

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
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar initialSession={session} />
        {children}
        <Footer />
      </body>
    </html>
  )
}