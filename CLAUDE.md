# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
npm run dev              # Start development server on port 3001
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript checking
```

### Database Operations (Cloudflare D1)
```bash
# Remote database (production)
npm run db:schema       # Apply schema to remote DB
npm run db:seed         # Seed remote DB with data
npm run db:status       # Check remote DB status
npm run db:migrate      # Full migration (schema + seed)

# Local database (development)
npm run db:local-schema # Apply schema locally
npm run db:local-seed   # Seed local DB
npm run db:local-migrate # Full local migration
```

### Testing & Quality
```bash
npm run test            # Run unit tests with Jest
npm run test:watch      # Run tests in watch mode
npm run test:e2e        # Run Playwright e2e tests
```

### Cloudflare Deployment
```bash
npx @cloudflare/next-on-pages@1  # Build for Cloudflare Pages deployment
```

## Architecture Overview

### Deployment Strategy
- **Frontend**: Cloudflare Pages with Next.js 14 App Router
- **Database**: Cloudflare D1 (SQLite) with multi-table schema
- **Runtime**: Edge Runtime for API routes
- **Authentication**: NextAuth.js with AWS Cognito integration

### Core Data Model
The platform centers around the `PromptTemplate` interface defined in `/src/types/index.ts`:

```typescript
interface PromptTemplate {
  // Core fields
  id, title, description, industry, useCase
  
  // Configuration
  promptConfig: { systemPrompt, userPromptTemplate, parameters, constraints }
  mcpServers: MCPServerConfig[]
  executionEnvironment: ExecutionEnvironment[]
  agentConfig: AgentOrchestrationConfig
  metadata: { category, complexity, estimatedRuntime, dependencies }
  
  // Management
  version, status, tags, collaborators, license
  parentTemplateId?, forkCount, isForked
}
```

### Database Architecture
The D1 database uses multiple related tables:
- `templates` - Core template data with JSON fields
- `template_tags` - Normalized tag relationships
- `template_parameters` - Template parameter definitions
- `mcp_servers` - MCP server configurations per template
- `template_forks` - Fork relationships
- `users` - User authentication and profiles
- `user_favorites` - User-template favorite relationships

### Key Database Operations
The `TemplateQueries` class in `/src/lib/database.ts` handles:
- `enrichTemplate()` - Fetches and assembles complete template data from multiple tables
- Multi-table joins for complex template queries
- Proper handling of JSON fields with fallbacks
- Fork and collaboration relationships

### Component Architecture

#### Unified Template Management
The platform uses a unified dialog system:
- `CreateTemplateDialog` - Handles both creation and editing with `isEditing` prop
- `TemplateInfoSections` - Structured view component for template display
- View mode uses `TemplateInfoSections` for proper data visualization
- Edit mode uses form tabs (Basic, Model & Prompt, Integrations, Advanced)

#### Key Display Components
- `TemplateCard` - Grid/list item display with actions
- `TemplateDetailsPanel` - Legacy component (replaced by unified dialog)
- `TemplateManager` - Bulk operations and management interface

### Data Flow Patterns

#### Template Fetching
```typescript
// Development: Uses localStorage fallback
// Production: Fetches from D1 via API routes
templateService.getAllTemplates() -> /api/templates -> TemplateQueries.findAll()
templateService.getUserTemplates() -> /api/templates?userTemplatesOnly=true
```

#### Template Refresh System
```typescript
// Real-time updates via event system
useTemplateRefresh(templateId) -> templateEvents.subscribe() -> API refresh
```

### MCP Server Integration
Templates can integrate with Model Context Protocol servers:
```typescript
interface MCPServerConfig {
  serverId: string
  serverType: 'firecrawl' | 'custom' | 'api-integrator' | 'file-processor'
  configuration: { endpoint, authentication, rateLimit, fallback }
  tools: MCPTool[]
  resources: MCPResource[]
}
```

### Industry Categorization
The platform organizes templates by industry verticals:
- Media & Entertainment, Healthcare & Life Science, Retail, Manufacturing
- Automotive, Financial Services, Gaming, Cross Industry

## Common Development Tasks

### Adding New Template Fields
1. Update `PromptTemplate` interface in `/src/types/index.ts`
2. Modify `enrichTemplate()` in `/src/lib/database.ts` for data fetching
3. Update `TemplateInfoSections` component for display
4. Add form fields to `CreateTemplateDialog` for editing

### Working with Database Queries
- Use `executeQuery()` helper for raw SQL operations
- Database bindings are auto-detected for Cloudflare environment
- Development mode returns empty arrays if DB unavailable
- Always use optional chaining for JSON field access

### Handling View vs Edit Modes
- `CreateTemplateDialog` with `isViewMode={true}` uses `TemplateInfoSections`
- `CreateTemplateDialog` with `isEditing={true}` uses form tabs
- Template data comes from either props or `useTemplateRefresh` hook

### Template State Management
- Templates flow through: Database -> API -> Service -> Component
- Use `templateEvents` system for real-time updates across components
- Cache strategies implemented in `template-service.ts`

## Important Implementation Notes

### Cloudflare D1 Considerations
- Database connections use complex fallback detection for various Cloudflare environments
- Edge Runtime limitations require careful async/await handling
- Foreign key pragmas may not be fully supported

### Authentication Flow
- NextAuth.js configuration in `/src/app/auth.config.js`
- AWS Cognito integration for production
- User context available via `useSession()` hook

### Component Rendering Patterns
- All components use TypeScript with proper interface definitions
- Shadcn/ui components as foundation with Tailwind CSS
- Conditional rendering based on `mode` props (view/edit)
- Robust null checking with meaningful fallbacks

### Template Lifecycle
1. Creation: Form -> Validation -> API -> Database -> Cache update
2. Editing: Fetch -> Form populate -> Update -> Refresh -> Event broadcast
3. Viewing: Fetch -> Structure -> Display via TemplateInfoSections
4. Forking: Clone -> Modify metadata -> Create new -> Link relationships