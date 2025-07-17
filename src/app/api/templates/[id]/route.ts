import { NextRequest, NextResponse } from 'next/server'
import { PromptTemplate, APIResponse } from '@/types'
import { TemplateQueries, AnalyticsQueries } from '@/lib/database'
import { auth } from '@/lib/auth-helper'

export const runtime = 'edge'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const template = await TemplateQueries.findById(params.id)
    
    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TEMPLATE_NOT_FOUND',
            message: 'Template not found'
          }
        },
        { status: 404 }
      )
    }

    // Record view analytics
    const session = await auth()
    await AnalyticsQueries.recordUsage(
      template.id, 
      session?.user?.id || null, 
      'view',
      { userAgent: request.headers.get('user-agent') }
    )

    const response: APIResponse<PromptTemplate> = {
      success: true,
      data: template
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching template:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch template',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const template = await TemplateQueries.findById(params.id)
    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TEMPLATE_NOT_FOUND',
            message: 'Template not found'
          }
        },
        { status: 404 }
      )
    }

    // Check ownership
    if (template.userId !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You can only edit your own templates'
          }
        },
        { status: 403 }
      )
    }

    const updates = await request.json()
    await TemplateQueries.update(params.id, updates)

    // Fetch updated template
    const updatedTemplate = await TemplateQueries.findById(params.id)
    
    // Record update analytics
    await AnalyticsQueries.recordUsage(params.id, session.user.id, 'update')

    return NextResponse.json({
      success: true,
      data: updatedTemplate
    })
  } catch (error) {
    console.error('Error updating template:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TEMPLATE_UPDATE_FAILED',
          message: 'Failed to update template',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // Check if template exists and verify ownership
    const templateCheck = await TemplateQueries.findBasicById(params.id)
    if (!templateCheck) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TEMPLATE_NOT_FOUND',
            message: 'Template not found'
          }
        },
        { status: 404 }
      )
    }

    // Check ownership
    if (templateCheck.user_id !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You can only delete your own templates'
          }
        },
        { status: 403 }
      )
    }

    await TemplateQueries.delete(params.id)
    
    // Record deletion analytics
    await AnalyticsQueries.recordUsage(params.id, session.user.id, 'delete')

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting template:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TEMPLATE_DELETE_FAILED',
          message: 'Failed to delete template',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}