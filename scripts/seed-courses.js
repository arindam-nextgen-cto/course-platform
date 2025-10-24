const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleCourses = [
  {
    title: 'Complete React Development',
    slug: 'complete-react-development',
    description: 'Master React.js from basics to advanced concepts with hands-on projects and real-world examples. Build modern web applications with hooks, context, and state management.',
    image: '/images/react-course.svg',
    level: 'Intermediate',
    category: 'Frontend Development',
    estimatedHours: 40,
    published: true,
    featured: true,
    prerequisites: 'Basic JavaScript knowledge, HTML/CSS fundamentals',
    learningGoals: 'Build modern React applications, Master hooks and state management, Understand component architecture'
  },
  {
    title: 'Multi-Platform Video Course Demo',
    slug: 'multi-platform-video-course-demo',
    description: 'Demonstration of video support across multiple platforms including YouTube, Vimeo, and self-hosted videos. Learn video integration best practices.',
    image: '/images/video-course.svg',
    level: 'Beginner',
    category: 'Demo',
    estimatedHours: 8,
    published: true,
    featured: false,
    prerequisites: 'No prerequisites required',
    learningGoals: 'Understand video platform integration, Learn multimedia content delivery'
  },
  {
    title: 'Complete JavaScript Tutorial',
    slug: 'complete-javascript-tutorial',
    description: 'Master JavaScript from basics to advanced concepts with hands-on projects and real-world examples. Perfect for beginners and career switchers.',
    image: '/images/javascript-course.svg',
    level: 'Beginner',
    category: 'Web Development',
    estimatedHours: 35,
    published: true,
    featured: true,
    prerequisites: 'Basic computer literacy, willingness to learn',
    learningGoals: 'Master JavaScript fundamentals, Build interactive web applications, Understand modern ES6+ features'
  },
  {
    title: 'React Fundamentals',
    slug: 'react-fundamentals',
    description: 'Master React.js from basics to advanced concepts. Learn component architecture, state management, and modern React patterns.',
    image: '/images/react-fundamentals.svg',
    level: 'Intermediate',
    category: 'Frontend Development',
    estimatedHours: 25,
    published: true,
    featured: false,
    prerequisites: 'JavaScript fundamentals, HTML/CSS knowledge',
    learningGoals: 'Build React components, Manage application state, Create responsive UIs'
  },
  {
    title: 'Node.js Backend Development',
    slug: 'nodejs-backend-development',
    description: 'Build scalable backend applications with Node.js and Express. Learn database integration, API development, and deployment strategies.',
    image: '/images/nodejs-course.svg',
    level: 'Advanced',
    category: 'Backend Development',
    estimatedHours: 45,
    published: true,
    featured: true,
    prerequisites: 'JavaScript proficiency, basic web development knowledge',
    learningGoals: 'Build REST APIs, Integrate databases, Deploy production applications'
  },
  {
    title: 'Introduction to Web Development',
    slug: 'introduction-to-web-development',
    description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect starting point for aspiring developers.',
    image: '/images/web-dev-intro.svg',
    level: 'Beginner',
    category: 'Web Development',
    estimatedHours: 30,
    published: true,
    featured: false,
    prerequisites: 'No prior experience required',
    learningGoals: 'Create responsive websites, Understand web technologies, Build your first web applications'
  }
]

const sampleCohorts = [
  {
    name: 'React Development - Winter 2025',
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-03-15'),
    capacity: 25,
    status: 'OPEN',
    price: 299.00,
    registrationDeadline: new Date('2025-01-10')
  },
  {
    name: 'React Development - Spring 2025',
    startDate: new Date('2025-04-01'),
    endDate: new Date('2025-06-01'),
    capacity: 30,
    status: 'UPCOMING',
    price: 299.00,
    registrationDeadline: new Date('2025-03-25')
  },
  {
    name: 'JavaScript Fundamentals - January 2025',
    startDate: new Date('2025-01-20'),
    endDate: new Date('2025-03-20'),
    capacity: 40,
    status: 'OPEN',
    price: 199.00,
    registrationDeadline: new Date('2025-01-15')
  },
  {
    name: 'JavaScript Fundamentals - March 2025',
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-05-01'),
    capacity: 35,
    status: 'UPCOMING',
    price: 199.00,
    registrationDeadline: new Date('2025-02-25')
  },
  {
    name: 'Node.js Backend - February 2025',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-04-30'),
    capacity: 20,
    status: 'OPEN',
    price: 399.00,
    registrationDeadline: new Date('2025-01-25')
  },
  {
    name: 'Web Development Bootcamp - January 2025',
    startDate: new Date('2025-01-10'),
    endDate: new Date('2025-04-10'),
    capacity: 50,
    status: 'OPEN',
    price: 149.00,
    registrationDeadline: new Date('2025-01-05')
  }
]

async function main() {
  console.log('🌱 Starting to seed courses and cohorts...')

  // First, find or create an admin user to be the course creator
  let adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!adminUser) {
    // Create a default admin user if none exists
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@nextgen-cto.com',
        name: 'Admin User',
        role: 'ADMIN'
      }
    })
    console.log('✅ Created admin user')
  }

  // Create courses
  const createdCourses = []
  for (const courseData of sampleCourses) {
    const existingCourse = await prisma.course.findUnique({
      where: { slug: courseData.slug }
    })

    if (!existingCourse) {
      const course = await prisma.course.create({
        data: {
          ...courseData,
          createdById: adminUser.id
        }
      })
      createdCourses.push(course)
      console.log(`✅ Created course: ${course.title}`)
    } else {
      createdCourses.push(existingCourse)
      console.log(`⏭️  Course already exists: ${existingCourse.title}`)
    }
  }

  // Create cohorts and associate them with courses
  const courseSlugToCohorts = {
    'complete-react-development': [0, 1], // React Development cohorts
    'complete-javascript-tutorial': [2, 3], // JavaScript cohorts
    'nodejs-backend-development': [4], // Node.js cohort
    'introduction-to-web-development': [5] // Web Dev cohort
  }

  for (const [courseSlug, cohortIndices] of Object.entries(courseSlugToCohorts)) {
    const course = createdCourses.find(c => c.slug === courseSlug)
    if (!course) continue

    for (const cohortIndex of cohortIndices) {
      const cohortData = sampleCohorts[cohortIndex]
      
      const existingCohort = await prisma.cohort.findFirst({
        where: {
          courseId: course.id,
          name: cohortData.name
        }
      })

      if (!existingCohort) {
        const cohort = await prisma.cohort.create({
          data: {
            ...cohortData,
            courseId: course.id,
            createdById: adminUser.id
          }
        })
        console.log(`✅ Created cohort: ${cohort.name} for ${course.title}`)
      } else {
        console.log(`⏭️  Cohort already exists: ${existingCohort.name}`)
      }
    }
  }

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })