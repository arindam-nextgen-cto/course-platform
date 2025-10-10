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
}