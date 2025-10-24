const { createClient } = require('@supabase/supabase-js')

// You'll need to add SUPABASE_SERVICE_ROLE_KEY to your .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  try {
    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'common@nextgen-cto.in',
      password: '123456',
      email_confirm: true,
      user_metadata: {
        name: 'Admin User'
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError.message)
      return
    }

    console.log('Auth user created:', authUser.user.id)

    // Update or create user in your application database
    const { data: appUser, error: appError } = await supabase
      .from('users')
      .upsert({
        id: authUser.user.id,
        email: 'common@nextgen-cto.in',
        name: 'Admin User',
        role: 'ADMIN'
      })
      .select()

    if (appError) {
      console.error('Error creating app user:', appError.message)
      return
    }

    console.log('Admin user created successfully!')
    console.log('Email: common@nextgen-cto.in')
    console.log('Password: 123456')
    console.log('Role: ADMIN')

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

createAdminUser()