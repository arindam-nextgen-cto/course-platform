import { createServerSupabaseClient } from '@/lib/supabase-server'
/* Using Supabase server client instead of Prisma */
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UserWithEnrollments } from '@/lib/types'

export const dynamic = 'force-dynamic'

// Fetch and assemble user data via Supabase server client.
// This uses multiple queries and normalizes common fields (startTime, createdAt)
// to match the shape previously expected by the UI.
async function getUserData(supabase: any, userId: string): Promise<any> {
  // Profile (commonly stored in 'profiles')
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  // Enrollments
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'ENROLLED')

  const enrichedEnrollments = await Promise.all((enrollments || []).map(async (enrollment: any) => {
    const { data: cohort } = await supabase
      .from('cohorts')
      .select('*')
      .eq('id', enrollment.cohort_id)
      .maybeSingle()

    const { data: course } = cohort
      ? (await supabase.from('courses').select('*').eq('id', cohort.course_id).maybeSingle()).data
      : null

    const { data: liveSessions } = cohort
      ? await supabase
        .from('live_sessions')
        .select('*')
        .eq('cohort_id', cohort.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(3)
      : { data: [] }

    // Normalize fields to match UI expectations
    const normalizedLiveSessions = (liveSessions || []).map((s: any) => ({
      ...s,
      startTime: s.start_time ?? s.startTime,
      embedUrl: s.embed_url ?? s.embedUrl
    }))

    return {
      ...enrollment,
      cohort: {
        ...cohort,
        course,
        liveSessions: normalizedLiveSessions
      }
    }
  }))

  // Lesson progress
  const { data: progressRows } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'COMPLETED')

  const enrichedProgress = await Promise.all((progressRows || []).map(async (p: any) => {
    const { data: lesson } = await supabase.from('lessons').select('*').eq('id', p.lesson_id).maybeSingle()
    const { data: section } = lesson ? await supabase.from('sections').select('*').eq('id', lesson.section_id).maybeSingle() : { data: null }
    const { data: course } = section ? await supabase.from('courses').select('*').eq('id', section.course_id).maybeSingle() : { data: null }

    return {
      ...p,
      lesson: {
        ...lesson,
        section: {
          ...section,
          course
        }
      }
    }
  }))

  // Normalize createdAt
  const createdAt = profile?.created_at ?? profile?.createdAt

  return {
    ...profile,
    name: profile?.name ?? profile?.full_name ?? profile?.email,
    createdAt,
    enrollments: enrichedEnrollments || [],
    lessonProgress: enrichedProgress || []
  }
}

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  const userData = await getUserData(supabase, session.user.id)

  if (!userData) {
    redirect('/auth/signin')
  }

  const upcomingSessions = (userData.enrollments || []).flatMap((enrollment: any) =>
    (enrollment.cohort?.liveSessions || []).map((ls: any) => ({
      ...ls,
      cohortName: enrollment.cohort?.name,
      courseName: enrollment.cohort?.course?.title,
    }))
  ).sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {userData.name || 'Student'}!</h1>
          <p className="text-xl text-muted-foreground">Continue your learning journey</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enrolled Cohorts */}
            <Card>
              <CardHeader>
                <CardTitle>My Cohorts</CardTitle>
                <CardDescription>
                  Your active learning cohorts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userData.enrollments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You're not enrolled in any cohorts yet</p>
                    <Link href="/courses">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userData.enrollments.map((enrollment: any) => (
                      <div key={enrollment.id} className="border rounded-lg p-4 bg-card">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-foreground">{enrollment.cohort.course.title}</h3>
                            <p className="text-muted-foreground">{enrollment.cohort.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">Started: {enrollment.cohort.startDate ? new Date(enrollment.cohort.startDate).toLocaleDateString() : 'TBD'}</p>
                          </div>
                          <Link href={`/cohorts/${enrollment.cohort.id}`}>
                            <Button size="sm">Continue</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Progress</CardTitle>
                <CardDescription>
                  Lessons you've completed recently
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userData.lessonProgress.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No completed lessons yet</p>
                ) : (
                  <div className="space-y-3">
                    {userData.lessonProgress.slice(0, 5).map((progress: any) => (
                      <div key={progress.id} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-[hsl(var(--secondary))] rounded-full"></div>
                        <div>
                          <p className="font-medium">{progress.lesson.title}</p>
                          <p className="text-sm text-muted-foreground">{progress.lesson.section.course.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>
                  Live sessions you shouldn't miss
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No upcoming sessions</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingSessions.map((up: any) => (
                      <div key={up.id} className="border rounded-lg p-3 bg-card">
                        <h4 className="font-semibold text-sm">{up.title}</h4>
                        <p className="text-xs text-muted-foreground">{up.courseName}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(up.startTime).toLocaleDateString()} at {new Date(up.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        {up.embedUrl && (
                          <Button size="sm" className="mt-2 w-full">Join Session</Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Enrolled Cohorts</span>
                    <span className="font-semibold">{userData.enrollments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed Lessons</span>
                    <span className="font-semibold">{userData.lessonProgress.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-semibold">{new Date(userData.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}