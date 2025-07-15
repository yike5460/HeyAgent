// Core Template Types
export interface PromptTemplate {
  id: string
  title: string
  description: string
  industry: IndustryVertical
  useCase: string
  promptConfig: PromptConfig
  mcpServers: MCPServerConfig[]
  executionEnvironment: ExecutionEnvironment[]
  agentConfig: AgentOrchestrationConfig
  metadata: TemplateMetadata
  version: number
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  userId: string
  author: string
  rating: number
  usageCount: number
  tags: string[]
  
  // Template inheritance and cloning
  parentTemplateId?: string
  forkCount: number
  isForked: boolean
  inheritanceConfig?: TemplateInheritanceConfig
  
  // Import/Export metadata
  exportMetadata?: TemplateExportMetadata
  
  // Collaboration
  collaborators: Collaboration[]
  isPublic: boolean
  license: 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'Custom' | 'Proprietary'
}

// Template Management Types
export interface TemplateInheritanceConfig {
  inheritedComponents: ('prompt' | 'mcpServers' | 'executionEnvironment' | 'agentConfig')[]
  customizations: TemplateCustomization[]
  mergeStrategy: 'override' | 'merge' | 'append'
}

export interface TemplateCustomization {
  component: string
  field: string
  originalValue: any
  customValue: any
  reason?: string
}

export interface TemplateExportMetadata {
  exportedAt: string
  exportedBy: string
  version: number
  includeSecrets: boolean
  format: 'json' | 'yaml'
  checksum: string
}

export interface TemplateImportResult {
  success: boolean
  templateId?: string
  errors: string[]
  warnings: string[]
  conflictResolutions?: ConflictResolution[]
}

export interface ConflictResolution {
  field: string
  conflict: 'name_exists' | 'version_mismatch' | 'dependency_missing'
  resolution: 'skip' | 'rename' | 'overwrite' | 'merge'
  newValue?: any
}

export interface PromptConfig {
  systemPrompt: string
  userPromptTemplate: string
  parameters: TemplateParameter[]
  constraints: PromptConstraints
}

export interface TemplateParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  description: string
  required: boolean
  defaultValue?: any
  validation?: ValidationRule[]
}

export interface PromptConstraints {
  maxTokens?: number
  temperature?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
}

export interface ValidationRule {
  type: 'minLength' | 'maxLength' | 'pattern' | 'range'
  value: any
  message: string
}

// MCP Server Types
export interface MCPServerConfig {
  serverId: string
  serverType: 'firecrawl' | 'custom' | 'api-integrator' | 'file-processor'
  configuration: {
    endpoint: string
    authentication: AuthConfig
    rateLimit: RateLimitConfig
    fallback: FallbackConfig
  }
  tools: MCPTool[]
  resources: MCPResource[]
}

export interface MCPTool {
  name: string
  description: string
  inputSchema: JSONSchema
  outputSchema: JSONSchema
  costEstimate: CostConfig
}

export interface MCPResource {
  uri: string
  name: string
  description: string
  mimeType?: string
}

export interface AuthConfig {
  type: 'apiKey' | 'oauth' | 'basic' | 'bearer'
  credentials: Record<string, string>
}

export interface RateLimitConfig {
  requestsPerMinute: number
  requestsPerHour: number
  burstLimit: number
}

export interface FallbackConfig {
  enabled: boolean
  fallbackServers: string[]
  retryAttempts: number
  timeoutMs: number
}

export interface CostConfig {
  estimatedCostPerCall: number
  currency: string
  billingModel: 'per-call' | 'per-token' | 'per-minute'
}

// Execution Environment Types
export interface ExecutionEnvironment {
  infrastructure: string
  requirements: string
}

// Agent Orchestration Types
export interface AgentOrchestrationConfig {
  workflow: WorkflowStep[]
  errorHandling: ErrorHandlingConfig
  monitoring: MonitoringConfig
  scaling: ScalingConfig
}

export interface WorkflowStep {
  id: string
  name: string
  type: 'prompt' | 'mcp-call' | 'environment-setup' | 'condition' | 'loop'
  configuration: Record<string, any>
  dependencies: string[]
  timeout: number
}

export interface ErrorHandlingConfig {
  retryPolicy: RetryPolicy
  fallbackActions: FallbackAction[]
  errorNotifications: NotificationConfig[]
}

export interface RetryPolicy {
  maxRetries: number
  backoffStrategy: 'linear' | 'exponential' | 'fixed'
  baseDelay: number
  maxDelay: number
}

export interface FallbackAction {
  condition: string
  action: 'retry' | 'skip' | 'alternative' | 'fail'
  parameters: Record<string, any>
}

export interface NotificationConfig {
  type: 'email' | 'webhook' | 'slack'
  recipients: string[]
  conditions: string[]
}

export interface MonitoringConfig {
  metricsCollection: boolean
  performanceTracking: boolean
  costTracking: boolean
  alerting: AlertConfig[]
}

export interface AlertConfig {
  metric: string
  threshold: number
  comparison: 'gt' | 'lt' | 'eq'
  action: string
}

export interface ScalingConfig {
  autoScaling: boolean
  minInstances: number
  maxInstances: number
  scaleUpThreshold: number
  scaleDownThreshold: number
}

// Template Metadata Types
export interface TemplateMetadata {
  category: string
  complexity: 'beginner' | 'intermediate' | 'advanced'
  estimatedRuntime: number
  resourceRequirements: ResourceRequirements
  dependencies: string[]
  changelog: ChangelogEntry[]
}

export interface ResourceRequirements {
  cpu: string
  memory: string
  storage: string
  network: boolean
}

export interface ChangelogEntry {
  version: string
  date: string
  changes: string[]
  author: string
}

// User and Collaboration Types
export interface User {
  id: string
  email: string
  username: string
  displayName: string
  profile: UserProfile
  roles: UserRole[]
  createdAt: string
  updatedAt: string
  cognitoId: string
}

export interface UserProfile {
  avatar?: string
  bio?: string
  company?: string
  location?: string
  website?: string
  socialLinks: Record<string, string>
}

export interface UserRole {
  role: 'admin' | 'creator' | 'collaborator' | 'viewer'
  scope: 'global' | 'template' | 'organization'
  resourceId?: string
}

export interface Collaboration {
  id: string
  templateId: string
  userId: string
  role: 'owner' | 'editor' | 'viewer'
  permissions: Permission[]
  invitedAt: string
  acceptedAt?: string
  status: 'pending' | 'accepted' | 'declined'
}

export interface Permission {
  action: 'read' | 'write' | 'delete' | 'share' | 'execute'
  resource: 'template' | 'config' | 'sandbox' | 'analytics'
}

// Sandbox Types
export interface SandboxSession {
  id: string
  userId: string
  templateId: string
  containerConfig: ContainerConfig
  status: 'starting' | 'running' | 'stopped' | 'error'
  metrics: SandboxMetrics
  startedAt: string
  endedAt?: string
  duration?: number
}

export interface ContainerConfig {
  image: string
  resources: ResourceLimits
  environment: Record<string, string>
  volumes: VolumeMount[]
  networking: NetworkConfig
}

export interface ResourceLimits {
  cpu: string
  memory: string
  storage: string
}

export interface VolumeMount {
  source: string
  target: string
  readOnly: boolean
}

export interface NetworkConfig {
  ports: PortMapping[]
  allowedHosts: string[]
}

export interface PortMapping {
  containerPort: number
  hostPort: number
  protocol: 'tcp' | 'udp'
}

export interface SandboxMetrics {
  cpuUsage: number
  memoryUsage: number
  networkIO: NetworkIO
  executionTime: number
  errorCount: number
  successRate: number
}

export interface NetworkIO {
  bytesIn: number
  bytesOut: number
  requestCount: number
}

// Analytics Types
export interface AnalyticsEvent {
  id: string
  timestamp: string
  userId: string
  templateId?: string
  eventType: EventType
  eventData: Record<string, any>
  sessionId?: string
}

export type EventType = 
  | 'template_created'
  | 'template_updated'
  | 'template_deleted'
  | 'template_cloned'
  | 'template_executed'
  | 'sandbox_started'
  | 'sandbox_stopped'
  | 'user_registered'
  | 'user_login'
  | 'collaboration_invited'
  | 'collaboration_accepted'

// Utility Types
export type IndustryVertical = 
  | 'Media & Entertainment'
  | 'Healthcare & Life Science'
  | 'Retail'
  | 'Manufacturing'
  | 'Automotive'
  | 'Financial Services'
  | 'Gaming'
  | 'Cross Industry'

export interface JSONSchema {
  type: string
  properties?: Record<string, JSONSchema>
  required?: string[]
  items?: JSONSchema
  additionalProperties?: boolean
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SearchFilters {
  industry?: IndustryVertical
  tags?: string[]
  rating?: number
  complexity?: string
  author?: string
  dateRange?: {
    start: string
    end: string
  }
}

export interface SortOptions {
  field: 'createdAt' | 'updatedAt' | 'rating' | 'usageCount' | 'title'
  direction: 'asc' | 'desc'
}