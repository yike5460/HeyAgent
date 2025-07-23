import { NextRequest, NextResponse } from 'next/server'
import { TemplateQueries, AnalyticsQueries, executeQuery } from '@/lib/database'
import { auth } from '@/lib/auth-helper'

export const runtime = 'edge'

interface RouteParams {
  params: { id: string }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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

    // Get the original template
    const originalTemplate = await TemplateQueries.findById(params.id)
    if (!originalTemplate) {
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

    // Create forked template
    const forkId = `fork-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const forkedTemplate = {
      ...originalTemplate,
      id: forkId,
      title: `${originalTemplate.title} (Fork)`,
      userId: session.user.id,
      author: session.user.name || session.user.email,
      status: 'draft' as const,
      isPublic: false,
      parentTemplateId: originalTemplate.id,
      isForked: true,
      rating: 0,
      usageCount: 0,
      forkCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Remove computed fields before creating
    const { createdAt, updatedAt, rating, usageCount, forkCount, ...templateData } = forkedTemplate

    // Create the forked template
    const created = await TemplateQueries.create(templateData)

    // Record the fork relationship
    await executeQuery(
      'INSERT INTO template_forks (id, original_template_id, forked_template_id, user_id, created_at) VALUES (?, ?, ?, ?, ?)',
      [`fork_${params.id}_${forkId}`, params.id, forkId, session.user.id, new Date().toISOString()]
    )

    // Update fork count on original template
    await executeQuery(
      'UPDATE templates SET fork_count = fork_count + 1 WHERE id = ?',
      [params.id]
    )

    // Record analytics
    await AnalyticsQueries.recordUsage(params.id, session.user.id, 'fork')

    return NextResponse.json({
      success: true,
      data: created,
      message: 'Template forked successfully'
    })
  } catch (error) {
    console.error('Error forking template:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FORK_FAILED',
          message: 'Failed to fork template',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}