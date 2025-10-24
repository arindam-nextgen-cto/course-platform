const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setAdminRole() {
  const email = 'common@nextgen-cto.in'
  
  try {
    // Find the user by email and update their role to ADMIN
    const user = await prisma.user.update({
      where: { email: email },
      data: { role: 'ADMIN' }
    })
    
    console.log('User role updated successfully:', user.email, 'is now an ADMIN')
  } catch (error) {
    console.error('Error updating user role:', error.message)
    
    // If the user doesn't exist, let's try to find all users to show what's available
    try {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true }
      })
      console.log('Available users:', users)
    } catch (listError) {
      console.error('Error listing users:', listError.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

setAdminRole()