# Project Structure & Organization

## Directory Layout

```
├── app/                    # Next.js App Router pages and layouts
│   ├── auth/              # Authentication pages (signin, signup, callback)
│   ├── courses/           # Course listing and details
│   ├── dashboard/         # User dashboard and analytics
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Homepage
├── components/            # Reusable React components
│   └── ui/               # shadcn/ui components (button, card, etc.)
├── lib/                  # Utility functions and configurations
│   ├── prisma.ts         # Prisma client instance
│   ├── supabase.ts       # Supabase client configuration
│   └── utils.ts          # Helper functions (cn, formatDate, etc.)
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Prisma schema definition
└── middleware.ts         # Next.js middleware for auth/routing
```

## Naming Conventions

### Files & Directories
- Use **kebab-case** for directories: `auth/signin`, `courses/[id]`
- Use **PascalCase** for React components: `Button.tsx`, `CourseCard.tsx`
- Use **camelCase** for utilities and configs: `utils.ts`, `supabase.ts`

### Database Schema
- Use **PascalCase** for model names: `User`, `Course`, `Enrollment`
- Use **camelCase** for field names: `createdAt`, `userId`, `enrollmentStatus`
- Use **SCREAMING_SNAKE_CASE** for enums: `USER_ROLE`, `ENROLLMENT_STATUS`

### React Components
- Use **PascalCase** for component names and files
- Export components as default exports
- Place related types in the same file or adjacent `.types.ts` file

## Code Organization Patterns

### Page Structure (App Router)
- Each route has its own directory under `app/`
- Use `page.tsx` for the main page component
- Use `layout.tsx` for shared layouts
- Use `loading.tsx` and `error.tsx` for loading and error states

### Component Architecture
- Keep components small and focused on single responsibility
- Use shadcn/ui components as building blocks
- Compose complex UI from smaller, reusable components
- Place shared components in `components/` directory

### Database Access
- All database operations go through Prisma client in `lib/prisma.ts`
- Use Prisma's generated types for type safety
- Follow the repository pattern for complex queries
- Keep database logic separate from UI components

### Styling Approach
- Use Tailwind CSS classes for styling
- Leverage shadcn/ui design tokens and CSS variables
- Use the `cn()` utility function for conditional classes
- Keep custom CSS minimal and in `globals.css`

## Import Conventions
- Use absolute imports from project root
- Group imports: external libraries, internal modules, relative imports
- Use TypeScript path mapping when configured

## Environment & Configuration
- Store environment variables in `.env` (use `.env.example` as template)
- Keep sensitive keys out of client-side code
- Use Next.js environment variable conventions (`NEXT_PUBLIC_` prefix for client-side)