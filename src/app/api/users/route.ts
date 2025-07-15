import { NextRequest, NextResponse } from 'next/server'
import { APIResponse, User } from '@/types'
import { UserQueries } from '@/lib/database'
import { auth } from '@/lib/auth-helper'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
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

    // For now, just return the current user
    // In the future, this could support listing users with proper pagination and filters
    const user = await UserQueries.findByEmail(session.user.email!)
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        },
        { status: 404 }
      )
    }

    const response: APIResponse<User> = {
      success: true,
      data: user
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching user:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch user',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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

    const updates = await request.json()
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { id, email, oauth_provider, oauth_provider_id, created_at, ...safeUpdates } = updates
    
    await UserQueries.update(session.user.id, safeUpdates)
    
    // Fetch updated user
    const updatedUser = await UserQueries.findByEmail(session.user.email!)
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Error updating user:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'USER_UPDATE_FAILED',
          message: 'Failed to update user profile',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}