import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-sync'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminCourseDetailPage({ params }: { params: { slug: string } }) {
    const user = await getCurrentUser()

    if (!user || (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR')) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-semibold">Access denied</h1>
                <p className="text-muted-foreground">You must be an admin or instructor to access this page.</p>
            </div>
        )
    }

    const course = await prisma.course.findUnique({
        where: { slug: params.slug },
        include: {
            createdBy: true,
            sections: {
                include: {
                    lessons: {
                        orderBy: {
                            orderIndex: 'asc'
                        }
                    }
                },
                orderBy: {
                    orderIndex: 'asc'
                }
            },
            cohorts: {
                include: {
                    _count: {
                        select: { enrollments: true }
                    }
                }
            }
        }
    })

    if (!course) {
        notFound()
    }

    // Check if user has permission to edit this course
    if (user.role !== 'ADMIN' && course.createdById !== user.id) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-semibold">Access denied</h1>
                <p className="text-muted-foreground">You don't have permission to edit this course.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">{course.title}</h1>
                    <div className="space-x-2">
                        <Link
                            href={`/admin/courses/${course.slug}/edit`}
                            className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90 transition-colors"
                        >
                            Edit Course
                        </Link>
                        <Link
                            href={`/courses/${course.slug}`}
                            className="rounded bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90 transition-colors"
                        >
                            View Live
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <div className="p-6 border rounded-lg bg-card">
                            <h2 className="text-xl font-semibold mb-4">Course Details</h2>
                            <div className="space-y-3">
                                <div>
                                    <h3 className="font-medium">Description</h3>
                                    <p className="text-muted-foreground">{course.description || 'No description provided'}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium">Slug</h3>
                                    <p className="text-muted-foreground">{course.slug}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium">Created by</h3>
                                    <p className="text-muted-foreground">{course.createdBy.name || course.createdBy.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="p-6 border rounded-lg bg-card">
                            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Sections</span>
                                    <span className="font-medium">{course.sections.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Lessons</span>
                                    <span className="font-medium">
                                        {course.sections.reduce((acc, section) => acc + section.lessons.length, 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Cohorts</span>
                                    <span className="font-medium">{course.cohorts.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Enrollments</span>
                                    <span className="font-medium">
                                        {course.cohorts.reduce((acc, cohort) => acc + cohort._count.enrollments, 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sections and Lessons */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">Course Content</h2>
                        <Link
                            href={`/admin/courses/${course.slug}/sections/new`}
                            className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90 transition-colors"
                        >
                            Add Section
                        </Link>
                    </div>

                    {course.sections.length === 0 ? (
                        <div className="p-8 text-center border rounded-lg">
                            <p className="text-muted-foreground mb-4">No sections created yet.</p>
                            <Link
                                href={`/admin/courses/${course.slug}/sections/new`}
                                className="rounded bg-primary px-4 py-2 text-white"
                            >
                                Create your first section
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {course.sections.map((section) => (
                                <div key={section.id} className="border rounded-lg bg-card">
                                    <div className="p-4 border-b flex items-center justify-between">
                                        <h3 className="font-semibold">{section.title}</h3>
                                        <div className="space-x-2">
                                            <Link
                                                href={`/admin/courses/${course.slug}/sections/${section.id}/edit`}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <Link
                                                href={`/admin/courses/${course.slug}/sections/${section.id}/lessons/new`}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Add Lesson
                                            </Link>
                                        </div>
                                    </div>

                                    {section.lessons.length === 0 ? (
                                        <div className="p-4 text-muted-foreground">
                                            No lessons in this section yet.
                                        </div>
                                    ) : (
                                        <ul className="divide-y">
                                            {section.lessons.map((lesson) => (
                                                <li key={lesson.id} className="p-4 flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium">{lesson.title}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {lesson.description || 'No description'}
                                                        </div>
                                                    </div>
                                                    <div className="space-x-2">
                                                        <Link
                                                            href={`/admin/courses/${course.slug}/lessons/${lesson.id}/edit`}
                                                            className="text-sm text-primary hover:underline"
                                                        >
                                                            Edit
                                                        </Link>
                                                        {lesson.videoUrl && (
                                                            <a
                                                                href={lesson.videoUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-primary hover:underline"
                                                            >
                                                                Watch
                                                            </a>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cohorts */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">Cohorts</h2>
                        <Link
                            href={`/admin/courses/${course.slug}/cohorts/new`}
                            className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90 transition-colors"
                        >
                            Create Cohort
                        </Link>
                    </div>

                    {course.cohorts.length === 0 ? (
                        <div className="p-8 text-center border rounded-lg">
                            <p className="text-muted-foreground mb-4">No cohorts created yet.</p>
                            <Link
                                href={`/admin/courses/${course.slug}/cohorts/new`}
                                className="rounded bg-primary px-4 py-2 text-white"
                            >
                                Create your first cohort
                            </Link>
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Dates</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Enrollments</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {course.cohorts.map((cohort) => (
                                        <tr key={cohort.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium">{cohort.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    {cohort.startDate ? new Date(cohort.startDate).toLocaleDateString() : 'N/A'} -
                                                    {cohort.endDate ? new Date(cohort.endDate).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {cohort._count.enrollments} students
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {cohort.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    href={`/admin/courses/${course.slug}/cohorts/${cohort.id}/edit`}
                                                    className="text-primary hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}