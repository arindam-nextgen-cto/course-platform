# Technology Stack

## Framework & Runtime
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Node.js 18+** runtime

## Database & ORM
- **PostgreSQL** (recommended: Neon DB)
- **Prisma ORM** for schema management and type-safe queries
- Database client: `@prisma/client`

## Authentication & Backend Services
- **Supabase Auth** for OAuth-only authentication (Google & GitHub)
- **Supabase** for additional backend services and storage

## UI & Styling
- **shadcn/ui** component library (built on Radix UI + Tailwind CSS)
- **Tailwind CSS** for styling with custom design tokens
- **Lucide React** for icons
- **Inter** font from Google Fonts

## Media & Payments
- **Mux Player React** (`@mux/mux-player-react`) for video playback
- **Stripe** for payment processing
- YouTube embeds as fallback for external video content

## Development Tools
- **TypeScript** for type safety
- **ESLint** with Next.js config for code quality
- **Prisma Studio** for database management
- **pnpm** as package manager

## Common Commands

### Development
```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Database Operations
```bash
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Create and run migrations
pnpm db:studio        # Open Prisma Studio
```

### Component Management
```bash
npx shadcn-ui@latest add <component>  # Add shadcn/ui components
```

## Environment Configuration
- Use `.env.example` as template for environment variables
- Required: `DATABASE_URL`, Supabase keys, Stripe keys
- Image domains configured for Google, GitHub, and Supabase avatars