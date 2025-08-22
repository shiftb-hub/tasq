# Task Completion Checklist for Tasq Project

When completing any coding task in the Tasq project, follow this checklist:

## 1. Code Quality Checks

### Linting
```bash
npm run lint
```
- Fix any ESLint errors or warnings
- Ensure no unused variables (though the rule is disabled, good practice to remove them)
- Check for any TypeScript errors in the output

### TypeScript Compilation
Since there's no explicit TypeScript check command, Next.js will check during build:
```bash
npm run build
```
- Ensure the build completes without TypeScript errors
- Fix any type errors that appear

## 2. Code Style Verification

### Formatting
- Ensure semicolons are used (Prettier config: `"semi": true`)
- Verify Tailwind classes are properly sorted (handled by prettier-plugin-tailwindcss)
- Check that imports are organized (external → internal → types)

### Naming Conventions
- Component files: PascalCase (e.g., `TaskCard.tsx`)
- Other files: kebab-case (e.g., `user-service.ts`)
- Private folders: underscore prefix (e.g., `_components`)

### Comments
- Ensure all comments and JSDoc are in Japanese
- Add JSDoc comments for public methods in service classes

## 3. Prisma/Database Changes

If you modified the Prisma schema:
```bash
# Push changes to database
npx prisma db push

# Regenerate Prisma client
npx prisma generate

# Test with Prisma Studio
npx prisma studio
```

## 4. Testing Checklist

Since there's no test suite configured:
- Manually test the feature in development environment
- Test both authenticated and unauthenticated states if applicable
- Verify the feature works with different user roles (STUDENT, TA, TEACHER, ADMIN)

## 5. Git Commit

Before committing:
- Review all changes with `git diff`
- Ensure no secrets or .env values are committed
- Use conventional commit messages (e.g., `feat:`, `fix:`, `chore:`)
- Commit message can be in English or Japanese

## 6. Final Verification

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the affected pages/features

3. Check browser console for any errors

4. Verify the UI looks correct at different screen sizes (mobile/desktop)

5. If working on authenticated routes, test with:
   - Logged out state → should redirect to login
   - Logged in state → should show the feature

## Important Reminders

- **NO console.log statements** in production code
- **NO hardcoded values** - use constants or environment variables
- **Follow existing patterns** in the codebase
- **Maintain type safety** - avoid using `any` type
- **Handle errors properly** - use try-catch blocks and custom error classes