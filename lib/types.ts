import { Prisma } from '@prisma/client'

// Course with related data
export type CourseWithCohorts = Prisma.CourseGetPayload<{
  include: {
    cohorts: {
      where: {
        status: {
          in: ['OPEN', 'UPCOMING']
        }
      }
    }
    _count: {
      select: {
        cohorts: true
      }
    }
  }
}>

// Cohort with related data
export type CohortWithCourse = Prisma.CohortGetPayload<{
  include: {
    course: true
    enrollments: true
    _count: {
      select: {
        enrollments: true
      }
    }
  }
}>

// User with enrollments
export type UserWithEnrollments = Prisma.UserGetPayload<{
  include: {
    enrollments: {
      include: {
        cohort: {
          include: {
            course: true
          }
        }
      }
    }
  }
}>

// Lesson with progress
export type LessonWithProgress = Prisma.LessonGetPayload<{
  include: {
    lessonProgress: true
    comments: {
      include: {
        user: true
        replies: {
          include: {
            user: true
          }
        }
      }
    }
  }
}>

// Section with lessons
export type SectionWithLessons = Prisma.SectionGetPayload<{
  include: {
    lessons: {
      include: {
        lessonProgress: true
      }
    }
  }
}>

// Course with full details
export type CourseWithDetails = Prisma.CourseGetPayload<{
  include: {
    sections: {
      include: {
        lessons: true
      }
    }
    cohorts: true
    createdBy: true
  }
}>