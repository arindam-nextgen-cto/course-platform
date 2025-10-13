import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Download,
  Trash2,
  ExternalLink,
  Settings as SettingsIcon
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle()

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  const userDisplayName = profile?.name ||
    session.user.user_metadata?.full_name ||
    session.user.user_metadata?.name ||
    'User'

  return (
  <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <a href="#profile" className="flex items-center px-3 py-2 text-sm font-medium text-orange-600 bg-[hsl(var(--accent)/0.12)] rounded-md">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </a>
                    <a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/6 rounded-md">
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </a>
                    <a href="#security" className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/6 rounded-md">
                      <Shield className="w-4 h-4 mr-2" />
                      Security
                    </a>
                    <a href="#billing" className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/6 rounded-md">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Billing
                    </a>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="md:col-span-3 space-y-6">
              {/* Profile Settings */}
              <Card id="profile">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your profile information and how others see you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={profile?.avatar || session.user.user_metadata?.avatar_url}
                        alt={userDisplayName}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] text-primary-foreground text-lg">
                        {getUserInitials(userDisplayName, session.user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">Change Avatar</Button>
                      <p className="text-xs text-muted-foreground mt-1">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Display Name
                      </label>
                      <div className="text-sm text-card-foreground p-2 bg-card rounded border border-border">
                        {userDisplayName}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Email
                      </label>
                      <div className="text-sm text-card-foreground p-2 bg-card rounded border border-border">
                        {session.user.email}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">{profile?.role || 'STUDENT'}</Badge>
                  </div>

                  <div className="flex justify-end">
                    <Button>Update Profile</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card id="notifications">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Course Updates</h4>
                        <p className="text-sm text-muted-foreground">Get notified about new lessons and course announcements</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Live Sessions</h4>
                        <p className="text-sm text-muted-foreground">Reminders for upcoming live sessions and cohort meetings</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Community</h4>
                        <p className="text-sm text-muted-foreground">Updates from discussions and community interactions</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card id="security">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security & Privacy
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Connected Accounts</h4>
                        <p className="text-sm text-muted-foreground">Signed in via {session.user.app_metadata?.provider || 'OAuth'}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Privacy Settings</h4>
                        <p className="text-sm text-muted-foreground">Control who can see your profile and activity</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Data Export</h4>
                        <p className="text-sm text-muted-foreground">Download a copy of your data</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Settings */}
              <Card id="billing">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Billing & Subscriptions
                  </CardTitle>
                  <CardDescription>
                    Manage your payment methods and subscriptions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No active subscriptions</h3>
                    <p className="text-muted-foreground mb-4">You're currently on the free plan. Upgrade to access premium features.</p>
                    <Button>View Plans</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <Trash2 className="w-5 h-5 mr-2" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-red-900">Delete Account</h4>
                      <p className="text-sm text-red-600">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}