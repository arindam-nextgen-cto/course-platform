import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Mail, MapPin, Clock, BookOpen, Award } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getUserProfile(supabase: any, userId: string) {
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  // Get enrollments with course info
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      *,
      cohorts (
        *,
        courses (*)
      )
    `)
    .eq('user_id', userId)

  // Get completed lessons count
  const { data: completedLessons, count: completedCount } = await supabase
    .from('lesson_progress')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('status', 'COMPLETED')

  return {
    profile,
    enrollments: enrollments || [],
    completedLessonsCount: completedCount || 0,
  }
}

export default async function ProfilePage() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  const userData = await getUserProfile(supabase, session.user.id)

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  const userDisplayName = userData.profile?.name ||
    session.user.user_metadata?.full_name ||
    session.user.user_metadata?.name ||
    'User'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={userData.profile?.avatar || session.user.user_metadata?.avatar_url}
                    alt={userDisplayName}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] text-primary-foreground text-lg">
                    {getUserInitials(userDisplayName, session.user.email)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">{userDisplayName}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {session.user.email}
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      Joined {new Date(userData.profile?.created_at || session.user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-[hsl(var(--secondary))/0.12] text-secondary-foreground">
                      {userData.profile?.role || 'STUDENT'}
                    </Badge>
                    {userData.enrollments.length > 0 && (
                      <Badge variant="outline" className="border-border text-muted-foreground">
                        Active Learner
                      </Badge>
                    )}
                  </div>
                </div>

                <Button>Edit Profile</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Stats */}
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Learning Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="text-muted-foreground">Enrolled Cohorts</span>
                    </div>
                    <span className="font-semibold text-lg">{userData.enrollments.length}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-muted-foreground">Completed Lessons</span>
                    </div>
                    <span className="font-semibold text-lg">{userData.completedLessonsCount}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-orange-500 mr-2" />
                      <span className="text-muted-foreground">Member Since</span>
                    </div>
                    <span className="font-semibold text-sm">
                      {userData.profile?.createdAt
                        ? new Date(userData.profile.createdAt).toLocaleDateString()
                        : 'Recently'
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="w-4 h-4 mr-2" />
                    View Certificates
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Learning History
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Enrollments */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My Enrollments</CardTitle>
                  <CardDescription>
                    Courses and cohorts you're currently enrolled in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userData.enrollments.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No enrollments yet</h3>
                        <p className="text-muted-foreground mb-4">
                        Start your learning journey by enrolling in a course
                      </p>
                      <Button>Browse Courses</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userData.enrollments.map((enrollment: any) => (
                        <div key={enrollment.id} className="border rounded-lg p-4 bg-card transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-foreground mb-1">
                                {enrollment.cohorts?.courses?.title || 'Course Title'}
                              </h3>
                              <p className="text-muted-foreground mb-2">
                                {enrollment.cohorts?.name || 'Cohort Name'}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>
                                  Status: <Badge variant="outline" className="ml-1">
                                    {enrollment.status}
                                  </Badge>
                                </span>
                                <span>
                                  Enrolled: {new Date(enrollment.enrolledAt || enrollment.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Button size="sm">Continue</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}