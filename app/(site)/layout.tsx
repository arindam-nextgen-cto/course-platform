import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Obtain session on the server so the navbar can render authenticated state on first load
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <>
      <Navbar initialSession={session} />
      {children}
      <Footer />
    </>
  )
}
