import { NextRequest, NextResponse } from 'next/server'
import { PromptTemplate, APIResponse } from '@/types'

export const runtime = 'edge'

// Mock data for demonstration
const mockTemplates: PromptTemplate[] = [
  {
    id: '1',
    title: 'Short Drama Production Assistant',
    description: 'Automated script generation, character development, and scene planning for short-form video content',
    industry: 'Media & Entertainment',
    useCase: 'Short Drama Production',
    promptConfig: {
      systemPrompt: 'You are an expert script writer and video production assistant.',
      userPromptTemplate: 'Create a short drama script for {genre} with {duration} minutes duration.',
      parameters: [
        {
          name: 'genre',
          type: 'string',
          description: 'The genre of the drama',
          required: true,
        },
        {
          name: 'duration',
          type: 'number',
          description: 'Duration in minutes',
          required: true,
          defaultValue: 5,
        },
      ],
      constraints: {
        maxTokens: 2000,
        temperature: 0.7,
      },
    },
    mcpServers: [
      {
        serverId: 'firecrawl',
        serverType: 'firecrawl',
        configuration: {
          endpoint: 'https://api.firecrawl.dev',
          authentication: {
            type: 'apiKey',
            credentials: { apiKey: 'fc-key' },
          },
          rateLimit: {
            requestsPerMinute: 60,
            requestsPerHour: 1000,
            burstLimit: 10,
          },
          fallback: {
            enabled: true,
            fallbackServers: [],
            retryAttempts: 3,
            timeoutMs: 30000,
          },
        },
        tools: [
          {
            name: 'scrape_webpage',
            description: 'Scrape content from a webpage',
            inputSchema: {
              type: 'object',
              properties: {
                url: { type: 'string' },
              },
              required: ['url'],
            },
            outputSchema: {
              type: 'object',
              properties: {
                content: { type: 'string' },
              },
            },
            costEstimate: {
              estimatedCostPerCall: 0.01,
              currency: 'USD',
              billingModel: 'per-call',
            },
          },
        ],
        resources: [],
      },
    ],
    saasIntegrations: [
      {
        provider: 'openai',
        service: 'gpt-4',
        configuration: {
          apiKey: 'sk-key',
          endpoint: 'https://api.openai.com/v1',
          version: 'v1',
          rateLimit: {
            requestsPerMinute: 60,
            requestsPerHour: 1000,
            burstLimit: 10,
          },
          costTracking: {
            enabled: true,
            budgetLimit: 100,
            alertThreshold: 80,
            trackingGranularity: 'per-call',
          },
        },
        capabilities: [
          {
            type: 'text-generation',
            parameters: [
              {
                name: 'model',
                type: 'string',
                description: 'Model to use',
                required: true,
                defaultValue: 'gpt-4',
              },
            ],
            constraints: [
              {
                name: 'max_tokens',
                value: 4000,
                description: 'Maximum tokens per request',
              },
            ],
          },
        ],
      },
    ],
    agentConfig: {
      workflow: [
        {
          id: 'step1',
          name: 'Generate Script Outline',
          type: 'prompt',
          configuration: {
            prompt: 'Create a script outline for {genre} drama',
          },
          dependencies: [],
          timeout: 30000,
        },
      ],
      errorHandling: {
        retryPolicy: {
          maxRetries: 3,
          backoffStrategy: 'exponential',
          baseDelay: 1000,
          maxDelay: 10000,
        },
        fallbackActions: [],
        errorNotifications: [],
      },
      monitoring: {
        metricsCollection: true,
        performanceTracking: true,
        costTracking: true,
        alerting: [],
      },
      scaling: {
        autoScaling: true,
        minInstances: 1,
        maxInstances: 10,
        scaleUpThreshold: 80,
        scaleDownThreshold: 20,
      },
    },
    metadata: {
      category: 'Content Creation',
      complexity: 'intermediate',
      estimatedRuntime: 120,
      resourceRequirements: {
        cpu: '0.5',
        memory: '1Gi',
        storage: '10Gi',
        network: true,
      },
      dependencies: ['openai', 'firecrawl'],
      changelog: [
        {
          version: '1.0.0',
          date: '2024-01-15',
          changes: ['Initial release'],
          author: 'John Doe',
        },
      ],
    },
    version: 1,
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    userId: 'user1',
    author: 'John Doe',
    rating: 4.8,
    usageCount: 1250,
    tags: ['video', 'script', 'automation', 'content-creation'],
    forkCount: 12,
    isForked: false,
    collaborators: [],
    isPublic: true,
    license: 'MIT'
  },
  // Add more mock templates as needed
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const industry = searchParams.get('industry')
    const tags = searchParams.get('tags')?.split(',')
    const sortField = searchParams.get('sortField') || 'createdAt'
    const sortDirection = searchParams.get('sortDirection') || 'desc'

    // Filter templates
    let filteredTemplates = mockTemplates

    if (industry) {
      filteredTemplates = filteredTemplates.filter(t => t.industry === industry)
    }

    if (tags && tags.length > 0) {
      filteredTemplates = filteredTemplates.filter(t =>
        tags.some(tag => t.tags.includes(tag))
      )
    }

    // Sort templates
    filteredTemplates.sort((a, b) => {
      const aValue = a[sortField as keyof PromptTemplate]
      const bValue = b[sortField as keyof PromptTemplate]
      
      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0
      if (aValue === undefined) return 1
      if (bValue === undefined) return -1
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Paginate
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex)

    const response: APIResponse<PromptTemplate[]> = {
      success: true,
      data: paginatedTemplates,
      pagination: {
        page,
        limit,
        total: filteredTemplates.length,
        totalPages: Math.ceil(filteredTemplates.length / limit),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching templates:', error)
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch templates',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    }

    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle different POST operations based on action
    const { action, ...templateData } = body
    
    if (action === 'import') {
      // Handle template import
      const { templates } = body
      // In a real implementation, you would validate and save the templates
      const importedTemplates = templates.map((template: any, index: number) => ({
        ...template,
        id: `imported-${Date.now()}-${index}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'current-user-id',
        author: 'Imported User',
        status: 'draft',
        version: 1,
        rating: 0,
        usageCount: 0
      }))
      
      return NextResponse.json({
        success: true,
        data: importedTemplates,
        message: `Successfully imported ${importedTemplates.length} templates`
      })
    }
    
    // Regular template creation
    const newTemplate: PromptTemplate = {
      id: `template-${Date.now()}`,
      title: templateData.title,
      description: templateData.description,
      industry: templateData.industry,
      useCase: templateData.useCase,
      promptConfig: templateData.promptConfig,
      mcpServers: templateData.mcpServers || [],
      saasIntegrations: templateData.saasIntegrations || [],
      agentConfig: templateData.agentConfig,
      metadata: templateData.metadata,
      version: 1,
      status: templateData.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'current-user-id',
      author: 'Current User',
      rating: 0,
      usageCount: 0,
      tags: templateData.tags || [],
      forkCount: 0,
      isForked: false,
      collaborators: [],
      isPublic: templateData.isPublic || false,
      license: templateData.license || 'MIT'
    }

    // In a real implementation, you would save to database
    mockTemplates.push(newTemplate)

    return NextResponse.json({
      success: true,
      data: newTemplate
    })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TEMPLATE_CREATION_FAILED',
          message: 'Failed to create template'
        }
      },
      { status: 500 }
    )
  }
}