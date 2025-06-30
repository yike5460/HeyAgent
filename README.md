# HeyPrompt - AI Prompt Gallery Platform

A comprehensive platform for creating, sharing, and deploying sophisticated AI-powered application templates with MCP server integration and containerized sandbox environments.

## 🚀 Features

### Core Platform Features
- **Template Management**: Create, edit, clone, and manage AI prompt templates
- **Industry Categorization**: Organize templates by industry verticals (Media & Entertainment, Healthcare, Retail, etc.)
- **MCP Server Integration**: Seamless integration with Model Context Protocol servers
- **SaaS Integrations**: Connect with external services (OpenAI, Anthropic, Kling, Veo3, etc.)
- **Sandbox Environment**: Test templates in isolated containerized environments
- **Real-time Collaboration**: Multi-user editing and sharing capabilities
- **Version Control**: Track changes and manage template versions
- **Analytics Dashboard**: Monitor usage, performance, and costs

### Technical Features
- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Cloud-Native Architecture**: AWS infrastructure with auto-scaling
- **Containerized Deployment**: Docker + AWS ECS Fargate
- **Multi-Database Architecture**: DynamoDB, ElastiCache, S3, OpenSearch
- **Authentication**: NextAuth.js with AWS Cognito
- **Real-time Updates**: WebSocket-based live collaboration

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: Zustand + React Query
- **Deployment**: Cloudflare Pages

### Backend Services
- **API**: RESTful APIs + GraphQL (Apollo Server)
- **Authentication**: AWS Cognito + JWT
- **Container Orchestration**: AWS ECS Fargate
- **File Storage**: Amazon S3
- **Caching**: Amazon ElastiCache (Redis)

### Database Architecture
- **Core Data**: Amazon DynamoDB
- **Search & Analytics**: Amazon OpenSearch
- **Session Management**: ElastiCache Redis
- **File Storage**: Amazon S3

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm 8+
- AWS Account with appropriate permissions
- Docker (for local development)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HeyPrompt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# Database Configuration
DYNAMODB_TABLE_PREFIX=heyprompt-dev
S3_BUCKET_NAME=heyprompt-assets
OPENSEARCH_ENDPOINT=https://your-opensearch-domain.us-east-1.es.amazonaws.com
REDIS_URL=redis://your-redis-endpoint:6379

# External API Keys
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
FIRECRAWL_API_KEY=your-firecrawl-api-key
```

## 🏭 Industry Use Cases

### Media & Entertainment
- **Short Drama Production**: Automated script generation and scene planning
- **ASMR Content Creation**: Personalized audio script generation
- **Video Content Planning**: Storyboard and content optimization

### Healthcare & Life Science
- **Clinical Documentation**: Medical report generation with HIPAA compliance
- **Drug Discovery**: Research paper analysis and compound prediction
- **Patient Care**: Treatment plan generation and medication management

### Retail
- **Product Description Generation**: Automated copywriting and SEO optimization
- **Customer Service**: Intelligent chatbot responses and FAQ generation
- **Marketing Campaigns**: Ad copy and social media content creation

### Manufacturing
- **Quality Control**: Defect detection and process optimization
- **Supply Chain**: Logistics optimization and vendor communication
- **Safety Compliance**: Risk assessment and protocol generation

### Financial Services
- **Risk Assessment**: Credit analysis and fraud detection
- **Regulatory Reporting**: Compliance documentation and audit preparation
- **Market Analysis**: Research report generation and trend analysis

### Gaming
- **Game Content**: Quest creation, dialogue writing, and world building
- **Player Analytics**: Engagement optimization and retention strategies
- **Community Management**: Response generation and content moderation

## 🔧 Development

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── ...               # Feature components
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
├── stores/               # State management
└── services/             # API services
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript checks

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:e2e        # Run end-to-end tests

# Docker
npm run docker:build   # Build Docker image
npm run docker:run     # Run Docker container
```

### Component Development

The project uses a component-driven architecture with:
- **Shadcn/ui**: Base UI components
- **Custom Components**: Feature-specific components
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling

Example component structure:
```typescript
interface ComponentProps {
  // Define props with TypeScript
}

export function Component({ ...props }: ComponentProps) {
  // Component implementation
  return <div>...</div>
}
```

## 🚀 Deployment

### Cloudflare Pages (Frontend)
1. Connect your repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `out`
4. Configure environment variables

### AWS Infrastructure (Backend)
1. **ECS Fargate**: Container orchestration
2. **Application Load Balancer**: Traffic distribution
3. **DynamoDB**: Primary database
4. **ElastiCache**: Caching layer
5. **S3**: File storage
6. **OpenSearch**: Search and analytics

### Infrastructure as Code
```bash
# Deploy with AWS CDK
npm install -g aws-cdk
cdk deploy
```

## 🔐 Security

### Authentication & Authorization
- AWS Cognito user pools
- JWT token-based authentication
- Role-based access control (RBAC)
- API key management for external services

### Data Protection
- Encryption at rest (DynamoDB, S3)
- Encryption in transit (TLS 1.3)
- HIPAA compliance for healthcare templates
- SOC 2 Type II compliance

### Container Security
- Least privilege execution
- Network isolation
- Resource limits and monitoring
- Vulnerability scanning

## 📊 Monitoring & Analytics

### Application Monitoring
- AWS CloudWatch metrics and logs
- AWS X-Ray distributed tracing
- Custom business metrics
- Error tracking with Sentry

### Performance Monitoring
- Core Web Vitals tracking
- API response time monitoring
- Database query optimization
- CDN performance metrics

### Cost Optimization
- Resource utilization monitoring
- Automated cost alerts
- Reserved instance recommendations
- Spot instance usage for non-critical workloads

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint + Prettier for code formatting
- Conventional commits for commit messages
- Component testing with React Testing Library
- E2E testing with Playwright

### Pull Request Process
1. Ensure all tests pass
2. Update documentation as needed
3. Add changeset for version management
4. Request review from maintainers

## 📝 API Documentation

### REST API Endpoints
```
GET    /api/templates          # List templates
POST   /api/templates          # Create template
GET    /api/templates/:id      # Get template
PUT    /api/templates/:id      # Update template
DELETE /api/templates/:id      # Delete template

GET    /api/sandbox/sessions   # List sandbox sessions
POST   /api/sandbox/start      # Start sandbox
POST   /api/sandbox/stop       # Stop sandbox

GET    /api/analytics/usage    # Usage analytics
GET    /api/analytics/performance # Performance metrics
```

### GraphQL Schema
```graphql
type Template {
  id: ID!
  title: String!
  description: String!
  industry: IndustryVertical!
  # ... other fields
}

type Query {
  templates(filters: TemplateFilters): [Template!]!
  template(id: ID!): Template
}

type Mutation {
  createTemplate(input: CreateTemplateInput!): Template!
  updateTemplate(id: ID!, input: UpdateTemplateInput!): Template!
}
```

## 🔗 Integration Examples

### MCP Server Integration
```typescript
const mcpConfig: MCPServerConfig = {
  serverId: 'firecrawl',
  serverType: 'firecrawl',
  configuration: {
    endpoint: 'https://api.firecrawl.dev',
    authentication: {
      type: 'apiKey',
      credentials: { apiKey: process.env.FIRECRAWL_API_KEY }
    }
  }
}
```

### SaaS Integration
```typescript
const saasConfig: SaaSIntegration = {
  provider: 'openai',
  service: 'gpt-4',
  configuration: {
    apiKey: process.env.OPENAI_API_KEY,
    endpoint: 'https://api.openai.com/v1',
    version: 'v1'
  }
}
```

## 📚 Resources

### Documentation
- [Architecture Guide](./ARCHITECTURE.md)
- [API Reference](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guide](./CONTRIBUTING.md)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)

**Built with ❤️ by the HeyPrompt Team**