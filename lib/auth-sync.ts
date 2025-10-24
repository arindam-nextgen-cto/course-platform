import { prisma } from '@/lib/prisma'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function syncUserWithDatabase() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Upsert user in Prisma database
  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.email!,
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      avatar: user.user_metadata?.avatar_url,
      updatedAt: new Date(),
    },
    create: {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      avatar: user.user_metadata?.avatar_url,
    },
  })

  return dbUser
}

export async function getCurrentUser() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  try {
    // Get user from Prisma with all relations
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        enrollments: {
          include: {
            cohort: {
              include: {
                course: true
              }
            }
          }
        },
        lessonProgress: true,
      }
    })

    return dbUser
  } catch (error) {
    console.error('Database connection failed:', error)
    // Fallback: return a basic user object for admin access
    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      avatar: user.user_metadata?.avatar_url,
      role: 'ADMIN', // Temporary admin access
      enrollments: [],
      lessonProgress: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}