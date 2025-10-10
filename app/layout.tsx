import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './globals.css'

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
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}