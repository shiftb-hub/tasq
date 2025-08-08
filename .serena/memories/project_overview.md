# Tasq Project Overview

## Project Purpose
Tasq is a task management web application designed for educational environments, likely used in a coding bootcamp or training program. The application supports different user roles (STUDENT, TA, TEACHER, ADMIN) and includes features for task board management, user profiles, and authentication.

## Tech Stack
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript (strict mode enabled)
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS v4 with custom component library
- **Database**: PostgreSQL with Prisma ORM (v6.11.1)
- **Authentication**: Supabase (with SSR support)
- **UI Components**: Radix UI primitives with custom wrapper components
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: SWR
- **Icons**: Lucide React and React Icons
- **Charts**: Recharts

## Main Features
- User authentication (signup/login)
- Task board management with drag-and-drop support
- User profile management with social media links
- Role-based access control
- Private and public routes separation

## Project Structure
```
src/
├── app/
│   ├── (private)/      # Protected routes
│   │   ├── settings/   # User settings page
│   │   ├── task-board/ # Task management board
│   │   └── api/        # Private API routes
│   ├── (public)/       # Public routes
│   │   ├── login/      # Login page
│   │   ├── signup/     # Registration page
│   │   └── api/        # Public API routes
│   ├── _actions/       # Server actions
│   ├── _components/    # Shared components
│   ├── _configs/       # Configuration files
│   ├── _constants/     # Constants
│   ├── _hooks/         # Custom React hooks
│   ├── _libs/          # Utility libraries
│   ├── _services/      # Business logic services
│   └── _types/         # TypeScript type definitions
├── middleware.ts       # Next.js middleware
└── globals.css        # Global styles
```

## Database Schema
The application uses PostgreSQL with Prisma ORM. Key models include:
- User (with roles: STUDENT, TA, TEACHER, ADMIN)
- Tasks and related entities
- Profile information with social media connections

## Development Notes
- All comments and documentation are in Japanese
- The project uses environment variables for Supabase and database configuration
- Development server uses Turbopack for faster builds
- No test suite is currently configured