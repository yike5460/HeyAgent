import { NextRequest, NextResponse } from 'next/server'
import { PromptTemplate, APIResponse } from '@/types'

export const runtime = 'edge'

// This would normally come from your database
// For now, we'll import the mock data from the main route
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
      parameters: [],
      constraints: {}
    },
    mcpServers: [],
    executionEnvironment: [],
    agentConfig: {
      workflow: [],
      errorHandling: {
        retryPolicy: {
          maxRetries: 3,
          backoffStrategy: 'exponential',
          baseDelay: 1000,
          maxDelay: 10000
        },
        fallbackActions: [],
        errorNotifications: []
      },
      monitoring: {
        metricsCollection: true,
        performanceTracking: true,
        costTracking: true,
        alerting: []
      },
      scaling: {
        autoScaling: true,
        minInstances: 1,
        maxInstances: 10,
        scaleUpThreshold: 80,
        scaleDownThreshold: 20
      }
    },
    metadata: {
      category: 'Content Creation',
      complexity: 'intermediate',
      estimatedRuntime: 120,
      resourceRequirements: {
        cpu: '0.5',
        memory: '1Gi',
        storage: '10Gi',
        network: true
      },
      dependencies: [],
      changelog: []
    },
    version: 1,
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    userId: 'user1',
    author: 'John Doe',
    usageCount: 1250,
    tags: ['video', 'script', 'automation', 'content-creation'],
    forkCount: 12,
    isForked: false,
    collaborators: [],
    isPublic: true,
    license: 'MIT'
  }
]

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id
    
    // Find the original template
    const originalTemplate = mockTemplates.find(t => t.id === templateId)
    
    if (!originalTemplate) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'TEMPLATE_NOT_FOUND',
          message: 'Template not found'
        }
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Parse request body for any customizations
    const body = await request.json().catch(() => ({}))
    const { title, description, ...customizations } = body

    // Create cloned template
    const clonedTemplate: PromptTemplate = {
      ...originalTemplate,
      id: `clone-${Date.now()}`,
      title: title || `${originalTemplate.title} (Copy)`,
      description: description || originalTemplate.description,
      ...customizations,
      version: 1,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'current-user-id', // TODO: Get from auth
      author: 'Current User', // TODO: Get from auth
      usageCount: 0,
      forkCount: 0,
      isForked: true,
      parentTemplateId: originalTemplate.id,
      collaborators: [],
      isPublic: false,
      license: originalTemplate.license,
      metadata: {
        ...originalTemplate.metadata,
        changelog: [
          {
            version: '1.0.0',
            date: new Date().toISOString().split('T')[0],
            changes: [`Cloned from template: ${originalTemplate.title}`],
            author: 'Current User'
          }
        ]
      }
    }

    // In a real implementation, you would save to database
    mockTemplates.push(clonedTemplate)

    const response: APIResponse<PromptTemplate> = {
      success: true,
      data: clonedTemplate
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error cloning template:', error)
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'CLONE_FAILED',
        message: 'Failed to clone template'
      }
    }

    return NextResponse.json(response, { status: 500 })
  }
} 