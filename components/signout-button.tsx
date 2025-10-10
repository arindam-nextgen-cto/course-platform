'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function SignOutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleSignOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/auth/signin')
    } catch (err) {
      console.error('Error signing out:', err)
      // Redirect to signin even if signOut fails to clear client state
      router.push('/auth/signin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleSignOut} disabled={loading}>
      Sign Out
    </Button>
  )
}