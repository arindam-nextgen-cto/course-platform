import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

async function getCourses() {
  return await prisma.course.findMany({
    include: {
      cohorts: {
        where: {
          status: {
            in: ['OPEN', 'UPCOMING']
          }
        },
        orderBy: {
          startDate: 'asc'
        }
      },
      _count: {
        select: {
          cohorts: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            NextGen-CTO
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Courses</h1>
          <p className="text-xl text-gray-600">
            Join structured learning cohorts and build real-world skills
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Button variant="outline" size="sm">All Categories</Button>
          <Button variant="outline" size="sm">Web Development</Button>
          <Button variant="outline" size="sm">Mobile Development</Button>
          <Button variant="outline" size="sm">DevOps</Button>
          <Button variant="outline" size="sm">Data Science</Button>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses available yet</h3>
              <p className="text-gray-600">Check back soon for new cohorts!</p>
            </div>
          ) : (
            courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {course.description}
                      </CardDescription>
                    </div>
                  </div>
                  {course.level && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {course.level}
                      </span>
                      {course.category && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {course.category}
                        </span>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.cohorts.length > 0 ? (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-2">
                          Upcoming Cohorts:
                        </h4>
                        <div className="space-y-2">
                          {course.cohorts.slice(0, 2).map((cohort) => (
                            <div key={cohort.id} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">
                                {cohort.startDate 
                                  ? new Date(cohort.startDate).toLocaleDateString()
                                  : 'TBD'
                                }
                              </span>
                              <span className="font-semibold">
                                {cohort.price ? formatCurrency(Number(cohort.price)) : 'Free'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No active cohorts</p>
                    )}
                    
                    <Link href={`/courses/${course.slug}`}>
                      <Button className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}