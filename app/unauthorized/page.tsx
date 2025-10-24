import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. 
          Please contact an administrator if you believe this is an error.
        </p>
        <div className="flex flex-col space-y-4">
          <Link 
            href="/" 
            className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90 transition-colors"
          >
            Go to Homepage
          </Link>
          <Link 
            href="/admin-signin" 
            className="text-primary hover:underline"
          >
            Admin Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}