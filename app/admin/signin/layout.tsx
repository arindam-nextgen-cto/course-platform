import { ReactNode } from 'react'
import Link from 'next/link'

export default function AdminSignInLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}