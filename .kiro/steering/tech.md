# Technology Stack

## Framework & Runtime

- **Next.js 15.3.5** with App Router
- **React 19** with TypeScript
- **Node.js** runtime

## Database & ORM

- **PostgreSQL** database
- **Prisma** ORM for database operations
- **Supabase** for authentication and database hosting

## Styling & UI

- **Tailwind CSS v4** for styling
- **Radix UI** components for accessible UI primitives
- **Lucide React** for icons
- **shadcn/ui** component system

## Form Handling & Validation

- **React Hook Form** for form management
- **Zod** for schema validation
- **@hookform/resolvers** for form validation integration

## Development Tools

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** with Tailwind plugin for code formatting
- **Turbopack** for fast development builds

## Common Commands

### Development

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Operations

```bash
npx prisma db push   # Push schema changes to database
npx prisma generate  # Generate Prisma client
npx prisma db seed   # Seed database with initial data
npx prisma studio    # Open Prisma Studio for database inspection
```

### Setup

```bash
npm i                # Install dependencies
```

## Environment Variables

- Requires `.env` file with database URLs and Supabase configuration
- Uses `NEXT_PUBLIC_` prefix for client-side environment variables
