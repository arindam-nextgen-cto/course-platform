import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import ThemeToggle from '@/components/theme-toggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NextGen-CTO - Authentication',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Keep this layout minimal: no html/body wrapper (handled by root layout).
  // Provide a centered, constrained container with the shared auth background.
  return (
    <div className={`${inter.className} min-h-screen relative`}>
      {/* Use CSS-driven theme tokens and a subtle overlay for the auth background so it adapts to light/dark */}
      <div className="absolute inset-0 bg-background" aria-hidden />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),transparent)] mix-blend-overlay pointer-events-none" aria-hidden />
      {/* Clickable brand mark: minimal top-left logo that returns to landing */}
      <Link
        href="/"
        aria-label="NextGen-CTO home"
        className="absolute left-4 top-4 md:left-8 md:top-8 z-30 p-2 rounded-lg hover:bg-accent/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">N</span>
        </div>
      </Link>

      {/* Top-right: theme toggle for the minimal auth layout */}
      <div className="absolute right-4 top-4 md:right-8 md:top-8 z-30">
        <ThemeToggle />
      </div>

      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <main className="w-full max-w-md">{children}</main>
      </div>
    </div>
  )
}
