const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '../.env.local' })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createAdminUser() {
  const email = 'common@nextgen-cto.in'
  const password = '123456'
  
  console.log('Creating admin user with email:', email)
  
  // Sign up the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (error) {
    console.error('Error creating user:', error.message)
    process.exit(1)
  }
  
  console.log('User created successfully:', data.user.id)
  
  // Note: In a real application, you would need to update the user's role in your database
  // This would typically be done through your application's database (Prisma in this case)
  // For now, we'll just create the Supabase auth user
  
  console.log('User created with email:', email)
  console.log('Please remember to update the user role to ADMIN in your database')
  console.log('You can do this by running a database query to set the role to ADMIN for this user')
}

createAdminUser()