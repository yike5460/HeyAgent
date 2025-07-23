import { NextRequest, NextResponse } from 'next/server'
import { TemplateQueries } from '@/lib/database'
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

    // Check if template exists
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

    // Add to favorites
    await TemplateQueries.addToFavorites(params.id, session.user.id)
    
    // Get updated favorite count
    const favoriteCount = await TemplateQueries.getFavoriteCount(params.id)

    return NextResponse.json({
      success: true,
      data: {
        favoriteCount,
        isFavorite: true
      }
    })
  } catch (error) {
    console.error('Error adding to favorites:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FAVORITE_ADD_FAILED',
          message: 'Failed to add to favorites',
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

    // Remove from favorites
    await TemplateQueries.removeFromFavorites(params.id, session.user.id)
    
    // Get updated favorite count
    const favoriteCount = await TemplateQueries.getFavoriteCount(params.id)

    return NextResponse.json({
      success: true,
      data: {
        favoriteCount,
        isFavorite: false
      }
    })
  } catch (error) {
    console.error('Error removing from favorites:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FAVORITE_REMOVE_FAILED',
          message: 'Failed to remove from favorites',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    // Check if template is favorited by user
    const isFavorite = await TemplateQueries.isFavorite(params.id, session.user.id)
    const favoriteCount = await TemplateQueries.getFavoriteCount(params.id)

    return NextResponse.json({
      success: true,
      data: {
        isFavorite,
        favoriteCount
      }
    })
  } catch (error) {
    console.error('Error checking favorite status:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FAVORITE_CHECK_FAILED',
          message: 'Failed to check favorite status',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}