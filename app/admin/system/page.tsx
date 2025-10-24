'use client'

import { useEffect, useState } from 'react'
import { createClientSupabaseClient } from '@/lib/supabase'

export default function AdminSystemPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold">Access denied</h1>
        <p className="text-muted-foreground">Only administrators can access this page.</p>
      </div>
    )
  }

  // In a real application, this would fetch actual system stats
  const systemStats = {
    totalUsers: 1243,
    totalCourses: 42,
    totalEnrollments: 3876,
    activeCohorts: 8,
    upcomingCohorts: 3
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">System Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold">{systemStats.totalUsers}</p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Total Courses</h3>
            <p className="text-3xl font-bold">{systemStats.totalCourses}</p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Total Enrollments</h3>
            <p className="text-3xl font-bold">{systemStats.totalEnrollments}</p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Active Cohorts</h3>
            <p className="text-3xl font-bold">{systemStats.activeCohorts}</p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Upcoming Cohorts</h3>
            <p className="text-3xl font-bold">{systemStats.upcomingCohorts}</p>
          </div>
        </div>
        
        <div className="border rounded-lg bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Platform Status</h3>
              <p className="text-green-600">All systems operational</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Last Backup</h3>
              <p>Today at 02:00 AM UTC</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Next Maintenance</h3>
              <p>None scheduled</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Storage Usage</h3>
              <p>45% of 100GB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}