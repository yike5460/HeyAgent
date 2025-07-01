import { NextRequest, NextResponse } from 'next/server'
import { PromptTemplate, APIResponse } from '@/types'

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
    
    // Validate required fields
    if (!body.title || !body.description || !body.industry) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields: title, description, industry',
        },
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Create new template
    const newTemplate: PromptTemplate = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      industry: body.industry,
      useCase: body.useCase || '',
      promptConfig: body.promptConfig || {
        systemPrompt: '',
        userPromptTemplate: '',
        parameters: [],
        constraints: {},
      },
      mcpServers: body.mcpServers || [],
      saasIntegrations: body.saasIntegrations || [],
      agentConfig: body.agentConfig || {
        workflow: [],
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
          autoScaling: false,
          minInstances: 1,
          maxInstances: 1,
          scaleUpThreshold: 80,
          scaleDownThreshold: 20,
        },
      },
      metadata: body.metadata || {
        category: 'General',
        complexity: 'beginner',
        estimatedRuntime: 60,
        resourceRequirements: {
          cpu: '0.1',
          memory: '256Mi',
          storage: '1Gi',
          network: false,
        },
        dependencies: [],
        changelog: [],
      },
      version: 1,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'current-user', // TODO: Get from auth
      author: 'Current User', // TODO: Get from auth
      rating: 0,
      usageCount: 0,
      tags: body.tags || [],
    }

    // TODO: Save to database
    mockTemplates.push(newTemplate)

    const response: APIResponse<PromptTemplate> = {
      success: true,
      data: newTemplate,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create template',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    }

    return NextResponse.json(response, { status: 500 })
  }
}