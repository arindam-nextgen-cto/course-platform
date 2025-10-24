import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { CourseWithCohorts } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function getCourses(): Promise<CourseWithCohorts[]> {
  const supabase = createServerSupabaseClient()

  const { data: courses, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .order('createdAt', { ascending: false })

  if (courseError) {
    throw courseError
  }

  const { data: cohorts, error: cohortError } = await supabase
    .from('cohorts')
    .select('*')
    .in('status', ['OPEN', 'UPCOMING'])
    .order('startDate', { ascending: true })

  if (cohortError) {
    throw cohortError
  }

  const cohortsByCourse = new Map<string, any[]>()
  for (const c of cohorts || []) {
    const arr = cohortsByCourse.get(c.courseId) || []
    arr.push(c)
    cohortsByCourse.set(c.courseId, arr)
  }

  return (courses || []).map((course: any) => ({
    ...course,
    cohorts: (cohortsByCourse.get(course.id) || []).map((cohort) => cohort),
    _count: { cohorts: (cohortsByCourse.get(course.id) || []).length }
  }))
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Available Courses</h1>
          <p className="text-xl text-muted-foreground">
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
              <h3 className="text-xl font-semibold text-foreground mb-2">No courses available yet</h3>
              <p className="text-muted-foreground">Check back soon for new cohorts!</p>
            </div>
          ) : (
            courses.map((course: CourseWithCohorts) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow flex flex-col h-full">
                {/* Course Thumbnail */}
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={course.image || '/images/course-placeholder.svg'}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  {course.level && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                        {course.level}
                      </span>
                    </div>
                  )}
                  {course.category && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                        {course.category}
                      </span>
                    </div>
                  )}
                </div>

                <CardHeader className="flex-grow">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-3 min-h-[4.5rem]">
                    {course.description || 'Comprehensive course designed to help you master essential skills and advance your career.'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{course.estimatedHours ? `${course.estimatedHours} hours` : '8-12 hours'}</span>
                      <span>{course._count?.cohorts || 0} cohorts</span>
                    </div>

                    {/* Cohort Information */}
                    {course.cohorts.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-foreground">
                          Next Cohort:
                        </h4>
                        <div className="flex justify-between items-center text-sm bg-muted/50 p-3 rounded-lg">
                          <div>
                            <div className="font-medium">
                              {course.cohorts[0].startDate
                                ? new Date(course.cohorts[0].startDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })
                                : 'Starting Soon'
                              }
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {course.cohorts[0].capacity ? `${course.cohorts[0].capacity} spots` : 'Limited spots'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              {course.cohorts[0].price ? formatCurrency(Number(course.cohorts[0].price)) : 'Free'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* View Details Button - Always at bottom */}
                    <div className="pt-2">
                      <Link href={`/courses/${course.slug}`} className="block">
                        <Button className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
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