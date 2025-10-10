import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NextGen-CTO - Authentication',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Keep this layout minimal: no html/body wrapper (handled by root layout).
  // Provide a centered, constrained container with the shared auth background.
  return (
    <div className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
      <main className="w-full max-w-md">{children}</main>
    </div>
  )
}
