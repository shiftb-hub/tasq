# Suggested Commands for Tasq Project

## Development Commands

### Initial Setup
```bash
# Clone repository
git clone https://github.com/shiftb-hub/tasq.git
cd tasq

# Install dependencies
npm i

# Database setup
npx prisma db push
npx prisma generate
npx prisma db seed

# Create .env file with required environment variables
```

### Development
```bash
# Start development server (with Turbopack)
npm run dev

# Open Prisma Studio for database inspection
npx prisma studio

# Run linting
npm run lint
```

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Database Commands
```bash
# Push schema changes to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed database with initial data
npx prisma db seed

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Git Commands (macOS/Darwin)
```bash
# Check current branch and status
git status

# Create and switch to new branch
git checkout -b feature/branch-name

# Stage and commit changes
git add .
git commit -m "feat: description"

# Push to remote
git push origin feature/branch-name
```

### System Utilities (macOS/Darwin)
```bash
# List files (macOS uses same as Linux)
ls -la

# Change directory
cd path/to/directory

# Search for files
find . -name "*.tsx"

# Search in files (using ripgrep if available, otherwise grep)
rg "search term" --type ts
grep -r "search term" --include="*.ts" .
```

## Important Notes
- No test commands are configured in the project
- The project uses npm (not yarn or pnpm)
- Development server runs on http://localhost:3000/
- Prisma Studio runs on http://127.0.0.1:54323
- Supabase local instance runs on http://127.0.0.1:54321