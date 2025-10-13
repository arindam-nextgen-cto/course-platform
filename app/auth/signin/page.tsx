'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Github, AlertCircle } from 'lucide-react'

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    // Check if user is already signed in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push(redirectTo)
      }
    }
    checkUser()
  }, [supabase, router, redirectTo])

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`
        }
      })
      if (error) throw error
    } catch (error: any) {
      console.error(`Error signing in with ${provider}:`, error)
      setError(error.message || `Failed to sign in with ${provider}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="max-w-md w-full space-y-8">
        {/* Compact header for conversion focus */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-1">Welcome back</h2>
          <p className="text-sm text-muted-foreground">Sign in to continue to your dashboard</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Sign In Card (focused) */}
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardContent className="space-y-4 py-8">
            <Button
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading}
              className="w-full py-4 text-lg bg-card/95 hover:bg-card/90 dark:bg-card dark:hover:bg-input text-foreground border-0 flex items-center justify-center"
              size="lg"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <Button
              onClick={() => handleOAuthSignIn('github')}
              disabled={loading}
              className="w-full py-4 text-lg bg-input hover:bg-accent/8 text-foreground border-border flex items-center justify-center"
              size="lg"
            >
              <Github className="w-5 h-5 mr-3" />
              {loading ? 'Signing in...' : 'Continue with GitHub'}
            </Button>
          </CardContent>
        </Card>

        {/* Minimal footer */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            New here?{' '}
            <Button asChild variant="link">
              <Link href="/auth/signup" className="font-medium text-orange-400 hover:text-orange-300">Create an account</Link>
            </Button>
          </p>

          <p className="text-xs text-muted-foreground mt-3">By signing in you agree to our <Link href="/terms" className="text-orange-400">Terms</Link> and <Link href="/privacy" className="text-orange-400">Privacy</Link>.</p>
        </div>
      </div>
  )
}