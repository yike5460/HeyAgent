import { NextRequest, NextResponse } from 'next/server'
import { PromptTemplate, APIResponse, SearchFilters, SortOptions } from '@/types'
import { TemplateQueries, AnalyticsQueries } from '@/lib/database'
import { auth } from '@/lib/auth-helper'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Build search filters
    const filters: SearchFilters = {}
    
    if (searchParams.get('industry')) {
      filters.industry = searchParams.get('industry')!.split(',')
    }
    
    if (searchParams.get('tags')) {
      filters.tags = searchParams.get('tags')!.split(',')
    }
    
    if (searchParams.get('rating')) {
      filters.rating = parseFloat(searchParams.get('rating')!)
    }
    
    if (searchParams.get('license')) {
      filters.license = searchParams.get('license')!.split(',')
    }
    
    if (searchParams.get('search')) {
      filters.search = searchParams.get('search')!
    }

    // Build sort options
    const sort: SortOptions = {
      field: (searchParams.get('sortField') as any) || 'created_at',
      direction: (searchParams.get('sortDirection') as 'asc' | 'desc') || 'desc'
    }

    // Special handling for user's own templates
    const userId = searchParams.get('userId')
    const includeUserTemplates = searchParams.get('includeUserTemplates') === 'true'
    let templates: PromptTemplate[]
    
    if (userId) {
      templates = await TemplateQueries.findByUserId(userId)
    } else if (includeUserTemplates) {
      // Get current user's session
      const session = await auth()
      if (session?.user?.id) {
        // Get both public templates and user's private templates
        const publicTemplates = await TemplateQueries.findAll(filters, sort, limit, offset)
        const userTemplates = await TemplateQueries.findByUserId(session.user.id)
        
        // Combine and deduplicate templates
        const templateMap = new Map<string, PromptTemplate>()
        
        // Add public templates first
        publicTemplates.forEach(t => templateMap.set(t.id, t))
        
        // Add user templates (will override public ones if same ID)
        userTemplates.forEach(t => templateMap.set(t.id, t))
        
        templates = Array.from(templateMap.values())
        
        // Apply sorting to combined results
        templates.sort((a, b) => {
          const aDate = new Date(a.createdAt || 0)
          const bDate = new Date(b.createdAt || 0)
          const aTime = isNaN(aDate.getTime()) ? 0 : aDate.getTime()
          const bTime = isNaN(bDate.getTime()) ? 0 : bDate.getTime()
          return sort.direction === 'desc' ? bTime - aTime : aTime - bTime
        })
      } else {
        // Not authenticated, return only public templates
        templates = await TemplateQueries.findAll(filters, sort, limit, offset)
      }
    } else {
      templates = await TemplateQueries.findAll(filters, sort, limit, offset)
    }

    // Get total count for pagination (simplified - in production you'd have a separate count query)
    const total = templates.length // This should be a proper count query
    
    const response: APIResponse<PromptTemplate[]> = {
      success: true,
      data: templates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Handle different POST operations based on action
    const { action, ...templateData } = body
    
    if (action === 'import') {
      // Handle template import
      const { templates } = body
      const importedTemplates = []
      
      for (const [index, template] of templates.entries()) {
        const newTemplate = {
          ...template,
          id: `imported-${Date.now()}-${index}`,
          userId: session.user.id,
          author: session.user.name || session.user.email,
          status: 'draft' as const,
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          rating: 0,
          usageCount: 0,
          forkCount: 0,
          is_public: false
        }
        
        const created = await TemplateQueries.create(newTemplate)
        importedTemplates.push(created)
      }
      
      return NextResponse.json({
        success: true,
        data: importedTemplates,
        message: `Successfully imported ${importedTemplates.length} templates`
      })
    }
    
    // Regular template creation
    const newTemplate = {
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: templateData.title,
      description: templateData.description,
      industry: templateData.industry,
      useCase: templateData.useCase,
      promptConfig: templateData.promptConfig,
      mcpServers: templateData.mcpServers || [],
      executionEnvironment: templateData.executionEnvironment || [],
      agentConfig: templateData.agentConfig,
      metadata: templateData.metadata,
      version: 1,
      status: templateData.status || 'draft',
      userId: session.user.id,
      author: session.user.name || session.user.email,
      tags: templateData.tags || [],
      parentTemplateId: undefined,
      isForked: false,
      inheritanceConfig: undefined,
      exportMetadata: undefined,
      collaborators: [],
      isPublic: templateData.isPublic || false,
      license: templateData.license || 'MIT'
    }

    const created = await TemplateQueries.create(newTemplate)

    // Record creation analytics
    await AnalyticsQueries.recordUsage(created.id, session.user.id, 'create')

    return NextResponse.json({
      success: true,
      data: created
    })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TEMPLATE_CREATION_FAILED',
          message: 'Failed to create template',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}