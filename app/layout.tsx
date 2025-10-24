import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import ConditionalLayout from '@/components/conditional-layout'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Toaster } from 'sonner'

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
      <body className={`${inter.className} bg-background text-foreground`}>
        {/* Inline script to set initial theme class before hydration to avoid FOUC */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{const t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}else if(!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark');}}catch(e){} })()` }} />
        <Providers>
          <ConditionalLayout session={session}>
            {children}
          </ConditionalLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}