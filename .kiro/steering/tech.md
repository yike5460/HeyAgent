# Technology Stack & Build System

## Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS + Shadcn/ui component library
- **State Management**: Zustand + TanStack React Query
- **Authentication**: NextAuth.js v5 (beta) with AWS Cognito
- **Deployment**: Cloudflare Pages with Wrangler

## Backend & Infrastructure
- **Runtime**: Node.js 18+ 
- **Database**: Cloudflare D1 (SQLite) with full-text search
- **Container Platform**: AWS ECS Fargate for sandbox environments
- **File Storage**: Amazon S3 for assets
- **Caching**: ElastiCache Redis for sessions
- **Search**: Amazon OpenSearch for analytics

## Key Libraries & Dependencies
- **UI Components**: Radix UI primitives (@radix-ui/react-*)
- **Forms**: React Hook Form with Zod validation
- **Visualization**: D3.js, React Flow, Recharts, Mermaid
- **Code Editor**: Monaco Editor (@monaco-editor/react)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **AWS SDK**: @aws-sdk/client-* packages

## Development Tools
- **Package Manager**: npm (requires 8.0.0+)
- **TypeScript**: v5.3.3 with strict configuration
- **Linting**: ESLint + Prettier with pre-commit hooks (Husky)
- **Testing**: Jest + React Testing Library + Playwright for E2E
- **Docker**: Multi-stage builds with production optimization

## Common Commands

### Development
```bash
npm run dev              # Start development server (localhost:3000)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
```

### Testing
```bash
npm run test            # Run unit tests with Jest
npm run test:watch      # Run tests in watch mode
npm run test:e2e        # Run Playwright E2E tests
```

### Database Operations
```bash
npm run db:schema       # Apply schema to remote D1 database
npm run db:seed         # Seed remote database with sample data
npm run db:status       # Check database status
npm run db:local-schema # Apply schema to local D1 database
npm run db:local-seed   # Seed local database
npm run db:local-migrate # Full local database setup
```

### Docker Operations
```bash
npm run docker:build   # Build Docker image
npm run docker:run     # Run Docker container locally
```

## Environment Configuration
- **Development**: `.env.local` with local database and API keys
- **Production**: Environment variables managed through Cloudflare Pages and Wrangler
- **Required Variables**: NEXTAUTH_URL, NEXTAUTH_SECRET, AWS credentials, API keys for external services

## Code Style & Conventions
- **TypeScript**: Strict mode enabled, no implicit any
- **Components**: Functional components with TypeScript interfaces
- **File Naming**: kebab-case for files, PascalCase for components
- **Import Paths**: Use `@/` alias for src directory imports
- **CSS**: Tailwind utility classes, custom CSS variables for theming
- **Database**: Prepared statements, JSON columns for complex data structures

## Performance Considerations
- **Bundle Optimization**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component with S3 integration
- **Caching**: Redis for sessions, CloudFront for static assets
- **Database**: Indexed queries, FTS for search functionality