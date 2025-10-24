'use client'

import { useEffect, useState } from 'react'
import { createClientSupabaseClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    async function fetchUsers() {
      try {
        // Get users from database
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .order('createdAt', { ascending: false })

        if (error) {
          console.error('Error fetching users:', error)
          setError('Failed to load users')
        } else {
          setUsers(users || [])
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive'
      case 'INSTRUCTOR': return 'default'
      case 'STUDENT': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage platform users</p>
        </div>
        <Button>Invite User</Button>
      </div>

      <div className="grid gap-4">
        {users && users.length > 0 ? (
          users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{user.name || 'Unnamed User'}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No users found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}