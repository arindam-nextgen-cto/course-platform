import { createServerSupabaseClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

async function getUserData(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: {
          cohort: {
            include: {
              course: true,
              liveSessions: {
                where: {
                  startTime: {
                    gte: new Date()
                  }
                },
                orderBy: {
                  startTime: 'asc'
                },
                take: 3
              }
            }
          }
        },
        where: {
          status: 'ENROLLED'
        }
      },
      lessonProgress: {
        include: {
          lesson: {
            include: {
              section: {
                include: {
                  course: true
                }
              }
            }
          }
        },
        where: {
          status: 'COMPLETED'
        }
      }
    }
  })
}

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  const userData = await getUserData(session.user.id)

  if (!userData) {
    redirect('/auth/signin')
  }

  const upcomingSessions = userData.enrollments.flatMap(enrollment => 
    enrollment.cohort.liveSessions.map(session => ({
      ...session,
      cohortName: enrollment.cohort.name,
      courseName: enrollment.cohort.course.title
    }))
  ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            NextGen-CTO
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/courses">
              <Button variant="outline">Browse Courses</Button>
            </Link>
            <Button variant="outline">Sign Out</Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {userData.name || 'Student'}!
          </h1>
          <p className="text-xl text-gray-600">
            Continue your learning journey
          </p>
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
                    <p className="text-gray-500 mb-4">You're not enrolled in any cohorts yet</p>
                    <Link href="/courses">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userData.enrollments.map((enrollment) => (
                      <div key={enrollment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {enrollment.cohort.course.title}
                            </h3>
                            <p className="text-gray-600">{enrollment.cohort.name}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Started: {enrollment.cohort.startDate 
                                ? new Date(enrollment.cohort.startDate).toLocaleDateString()
                                : 'TBD'
                              }
                            </p>
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
                  <p className="text-gray-500 text-center py-4">
                    No completed lessons yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {userData.lessonProgress.slice(0, 5).map((progress) => (
                      <div key={progress.id} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{progress.lesson.title}</p>
                          <p className="text-sm text-gray-500">
                            {progress.lesson.section.course.title}
                          </p>
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
                  <p className="text-gray-500 text-center py-4">
                    No upcoming sessions
                  </p>
                ) : (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-3">
                        <h4 className="font-semibold text-sm">{session.title}</h4>
                        <p className="text-xs text-gray-600">{session.courseName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(session.startTime).toLocaleDateString()} at{' '}
                          {new Date(session.startTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {session.embedUrl && (
                          <Button size="sm" className="mt-2 w-full">
                            Join Session
                          </Button>
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
                    <span className="text-gray-600">Enrolled Cohorts</span>
                    <span className="font-semibold">{userData.enrollments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed Lessons</span>
                    <span className="font-semibold">{userData.lessonProgress.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-semibold">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </span>
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