'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Platform configuration and settings</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Platform Name</label>
                <p className="text-sm text-muted-foreground">NextGen-CTO</p>
              </div>
              <div>
                <label className="text-sm font-medium">Environment</label>
                <p className="text-sm text-muted-foreground">Development</p>
              </div>
              <Button variant="outline">Edit Settings</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>OAuth and authentication settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">OAuth Providers</label>
                <p className="text-sm text-muted-foreground">Google, GitHub</p>
              </div>
              <div>
                <label className="text-sm font-medium">Admin Email Auth</label>
                <p className="text-sm text-muted-foreground">Enabled</p>
              </div>
              <Button variant="outline">Configure Auth</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database</CardTitle>
            <CardDescription>Database connection and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <p className="text-sm text-green-600">Connected</p>
              </div>
              <div>
                <label className="text-sm font-medium">Provider</label>
                <p className="text-sm text-muted-foreground">Supabase PostgreSQL</p>
              </div>
              <Button variant="outline">View Database</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}