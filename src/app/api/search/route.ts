import { NextRequest, NextResponse } from 'next/server'
import { PromptTemplate, APIResponse } from '@/types'
import { SearchQueries, AnalyticsQueries } from '@/lib/database'
import { auth } from '@/lib/auth-helper'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_QUERY',
            message: 'Search query must be at least 2 characters long'
          }
        },
        { status: 400 }
      )
    }

    // Perform full-text search
    const templates = await SearchQueries.fullTextSearch(query.trim(), limit)
    
    // Record search analytics
    const session = await auth()
    if (session?.user?.id) {
      await AnalyticsQueries.recordUsage(
        'search', 
        session.user.id, 
        'search',
        { 
          query: query.trim(),
          resultsCount: templates.length,
          userAgent: request.headers.get('user-agent')
        }
      )
    }

    const response: APIResponse<PromptTemplate[]> = {
      success: true,
      data: templates,
      metadata: {
        query: query.trim(),
        resultsCount: templates.length
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error performing search:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SEARCH_FAILED',
          message: 'Search request failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}

// Get popular search tags
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'popular-tags') {
      const limit = 50 // Get top 50 tags
      const tags = await SearchQueries.getPopularTags(limit)
      
      return NextResponse.json({
        success: true,
        data: tags
      })
    }
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_ACTION',
          message: 'Invalid action specified'
        }
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in search POST:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SEARCH_FAILED',
          message: 'Search request failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}