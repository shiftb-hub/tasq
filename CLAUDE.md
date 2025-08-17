# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TASQ is a Next.js-based learning management and task tracking application for educational environments, built using:
- **Next.js 15.3.5** with React 19 and TypeScript
- **Supabase** for authentication and real-time features  
- **Prisma** with PostgreSQL for database management
- **Tailwind CSS** with custom UI components (shadcn/ui style)
- **SWR** for client-side data fetching

## Development Commands

### Core Development
```bash
# Install dependencies
npm i

# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Database Operations
```bash
# Push database schema changes
npx prisma db push

# Generate Prisma client
npx prisma generate  

# Seed database with initial data
npx prisma db seed

# Open Prisma Studio for database inspection
npx prisma studio

# TypeScript type checking (check if available)
# npm run typecheck
```

### Testing & Quality
```bash
# Run linting
npm run lint

# Run tests (Vitest)
npm run test

# Format code with Prettier (if configured)
npm run format
```

## Architecture Overview

### Route Structure
- **`(public)`** routes: No authentication required (`/`, `/login`, `/signup`, `/error`)
- **`(private)`** routes: Authentication required (all other routes)
- Authentication middleware automatically redirects unauthenticated users to `/login`

### Key Directories
- **`(private)/`**: Protected routes requiring authentication (tasks, profile, settings)
- **`(public)/`**: Public routes (login, signup, landing page)
- **`_components/`**: Reusable React components, including UI primitives
  - **`ui/`**: shadcn/ui based component library
  - **`sidebar/`**: Application sidebar components
- **`_libs/`**: Core utilities (Supabase clients, Prisma, authentication helpers)
- **`_types/`**: TypeScript type definitions and schemas  
- **`_services/`**: Business logic and data access layers
- **`_hooks/`**: Custom React hooks
- **`_configs/`**: Application configuration (public paths, app settings)
- **`_actions/`**: Server actions for form submissions

### Authentication Flow
- Middleware (`src/middleware.ts`) handles route protection and session management
- Uses Supabase SSR with automatic session refresh
- Public paths defined in `src/app/_configs/app-config.ts`
- API routes return JSON errors for unauthenticated requests
- Page routes redirect to `/login` for unauthenticated users
- Middleware matcher excludes static files, images, and favicon

### Testing Architecture
- **Framework**: Vitest with Node.js environment
- **Configuration**: `vitest.config.ts` with tsconfig paths support
- **Test Files**: Located in `tests/**/*.spec.ts`
- **Setup**: Automatic dotenv config loading and Prisma setup
- **Environment**: Separate `.env.test` file for test database configuration
- **VSCode Integration**: Available via Vitest Explorer extension (`vitest.explorer`)

### Database Schema
The Prisma schema includes:
- **User**: Profiles with roles (STUDENT, TA, TEACHER, ADMIN) with social media links and chapter progress
- **Task**: User-created tasks with status, tags, activity types, and timing information
- **LearningLog**: Time tracking, learning progress, and reflections (学習ログ)
- **AssignmentLog**: Teacher assignment tracking for task responses (担当ログ)
- **TeacherTask**: Teacher bookmarks for student tasks
- **TeacherStudent**: Teacher-student relationship management
- **Status/Tag/ActivityType**: Master data for task categorization

### Environment Setup
This project uses **Supabase local development environment**. 

Required environment variables (see README.md for full setup):

**Development (.env):**
```env
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000/
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
DIRECT_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb.....
SB_SERVICE_ROLE_KEY=eyJhb.....
```

**Testing (.env.test):**
```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
DIRECT_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

**Important**: The `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SB_SERVICE_ROLE_KEY` values must be obtained from the [tasq-sb-dev](https://github.com/shiftb-hub/tasq-sb-dev) repository by running `npx supabase start`. This sets up the local Supabase development environment that TASQ depends on.

## Code Conventions

### Language & Documentation
- **Primary language**: Japanese (日本語)
- Database schema and comments are written in Japanese
- README and documentation in Japanese
- Code comments should be in Japanese when appropriate

### Import Paths
- Use `@/` alias for src directory imports
- Organize imports: external libraries first, then internal modules

### Component Structure
- Functional components with TypeScript
- Props interface named `Props` 
- Use `React.FC<Props>` type annotation
- File-based routing with page.tsx and layout.tsx conventions

### State Management
- SWR for server state and caching
- React Context for global UI state (sidebar, etc.)
- Form state managed with react-hook-form + Zod validation

### Styling
- Tailwind CSS utility classes
- Custom UI components in `_components/ui/`
- Responsive design patterns with mobile-first approach

### Error Handling
- Centralized error types in `_types/AppErrorCodes.ts`
- API responses use standardized `ApiResponse<T>` format
- Client-side error boundaries for graceful degradation