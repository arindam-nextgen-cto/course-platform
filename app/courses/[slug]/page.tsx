import { prisma } from '@/lib/prisma'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'
import CoursePlayer from '../../../components/course-player'

export const dynamic = 'force-dynamic'

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = params

    const course = await prisma.course.findUnique({
        where: { slug },
        include: {
            sections: { orderBy: { orderIndex: 'asc' }, include: { lessons: { orderBy: { orderIndex: 'asc' } } } },
            createdBy: true,
            cohorts: true
        }
    })

    if (!course) return (<div className="container mx-auto p-8">Course not found</div>)

    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Check if the current user is enrolled in any cohort belonging to this course
    const enrolled = user
        ? await prisma.enrollment.findFirst({
            where: {
                userId: user.id,
                cohort: {
                    is: {
                        courseId: course.id
                    }
                }
            }
        })
        : null

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold">{course.title}</h1>
                    <p className="text-sm text-muted-foreground">By {course.createdBy?.name || 'Instructor'}</p>

                    {/* Show first published lesson video */}
                    {course.sections?.[0]?.lessons?.[0] && (
                        <div className="mt-6">
                            <CoursePlayer lesson={course.sections[0].lessons[0]} courseId={course.id} />
                        </div>
                    )}

                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold">Syllabus</h2>
                        <div className="space-y-4 mt-4">
                            {course.sections.map((section) => (
                                <div key={section.id} className="p-4 border rounded">
                                    <h3 className="font-semibold">{section.title}</h3>
                                    <ul className="mt-2 space-y-2">
                                        {section.lessons.map((lesson) => (
                                            <li key={lesson.id} className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">{lesson.title}</div>
                                                    <div className="text-sm text-muted-foreground">{lesson.description}</div>
                                                </div>
                                                <div>
                                                    <Link href={`#lesson-${lesson.id}`} className="text-primary">Open</Link>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="space-y-4">
                    <div className="p-4 border rounded">
                        <h4 className="font-semibold">Course Info</h4>
                        <p className="text-sm text-muted-foreground mt-2">{course.description}</p>
                        <div className="mt-4">
                            {user ? (
                                enrolled ? (
                                    <div className="text-sm text-green-600">Enrolled</div>
                                ) : (
                                    <form action="/api/enroll" method="post">
                                        <input type="hidden" name="courseId" value={course.id} />
                                        <button type="submit" className="w-full rounded bg-primary px-4 py-2 text-white">Enroll</button>
                                    </form>
                                )
                            ) : (
                                <Link href="/auth/signin" className="w-full inline-block rounded bg-primary px-4 py-2 text-white text-center">Sign in to enroll</Link>
                            )}
                        </div>
                    </div>

                    <div className="p-4 border rounded">
                        <h4 className="font-semibold">Progress</h4>
                        <p className="text-sm text-muted-foreground mt-2">Track your completed lessons here once you start the course.</p>
                    </div>
                </aside>
            </div>
        </div>
    )
}
