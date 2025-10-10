import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative`}>
      {/* Clickable brand mark: minimal top-left logo that returns to landing */}
      <Link
        href="/"
        aria-label="NextGen-CTO home"
        className="absolute left-4 top-4 md:left-8 md:top-8 z-30 p-2 rounded-lg hover:bg-white/3 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">N</span>
        </div>
      </Link>

      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <main className="w-full max-w-md">{children}</main>
      </div>
    </div>
  )
}
