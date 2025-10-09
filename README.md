# NextGen-CTO Learning Platform

A cohort-based learning platform built with Next.js, Prisma, and Supabase.

## Features

- 🔐 OAuth authentication (Google & GitHub)
- 📚 Course and cohort management
- 🎥 Video lesson delivery with Mux player
- 📊 Progress tracking
- 💬 Discussion and comments
- 📅 Live session scheduling
- 💳 Payment integration with Stripe
- 📱 Responsive design with shadcn/ui

## Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui (Radix + Tailwind)
- **Video Player**: Mux Player React
- **Payments**: Stripe
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use Neon DB)
- Supabase project
- Stripe account (for payments)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd nextgen-cto
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Fill in your environment variables in `.env`.

4. Set up the database:
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses the following main entities:

- **User**: Student, instructor, and admin accounts
- **Course**: Course templates with sections and lessons
- **Cohort**: Scheduled instances of courses
- **Enrollment**: User enrollment in cohorts
- **Lesson**: Individual lessons with video and text content
- **LessonProgress**: Tracking user progress through lessons
- **LiveSession**: Scheduled live sessions for cohorts
- **Comment**: Discussion threads on lessons
- **Transaction**: Payment records

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── courses/           # Course listing and details
│   ├── dashboard/         # User dashboard
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── prisma.ts         # Database client
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema and migrations
└── public/               # Static assets
\`\`\`

## Development

### Database Operations

- Generate Prisma client: \`npm run db:generate\`
- Push schema changes: \`npm run db:push\`
- Create migration: \`npm run db:migrate\`
- Open Prisma Studio: \`npm run db:studio\`

### Adding New Components

This project uses shadcn/ui components. To add new components:

\`\`\`bash
npx shadcn-ui@latest add <component-name>
\`\`\`

## Deployment

The application is designed to be deployed on Vercel with a PostgreSQL database (Neon DB recommended).

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.