# Project Structure

## Root Level

- **Configuration files**: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`
- **Environment**: `.env` for local development variables
- **Database**: `prisma/` folder contains schema and seed files

## Source Code Organization (`src/app/`)

### App Router Structure

- **Pages**: Route files like `page.tsx` and `layout.tsx`
- **API Routes**: `api/` folder for backend endpoints

### Internal Folders (prefixed with `_`)

- **`_components/`**: Reusable React components
  - `ui/` subfolder for shadcn/ui components (button, input, etc.)
- **`_libs/`**: Utility libraries and external service integrations
  - `prisma.ts` for database client
  - `supabase/` for authentication client
  - `utils.ts` for common utilities (cn function)
- **`_types/`**: TypeScript type definitions and Zod schemas
- **`_configs/`**: Application configuration and constants
- **`_hooks/`**: Custom React hooks

## Naming Conventions

### Files & Folders

- **Components**: PascalCase (e.g., `FormErrorMessage.tsx`)
- **Pages**: lowercase `page.tsx` and `layout.tsx`
- **Internal folders**: Prefixed with underscore `_`
- **API routes**: `route.ts` files

### Code Style

- **React components**: PascalCase with explicit typing
- **Functions**: camelCase
- **Constants**: camelCase for configs, UPPER_CASE for environment variables
- **Database fields**: snake_case (mapped from camelCase in Prisma)

## Database Schema

- **Models**: PascalCase (User, Task, Status)
- **Relations**: Clearly defined with foreign keys
- **Enums**: UPPER_CASE values (STUDENT, TEACHER, etc.)
- **Timestamps**: `createdAt` and `updatedAt` fields standard

## Import Patterns

- **Next.js**: Use `NextLink` alias for `next/link`
- **Utilities**: Import `cn` function for className merging
- **Types**: Centralized in `_types/` folder
