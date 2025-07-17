import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import { auth } from '@/lib/auth-helper'

export const runtime = 'edge'

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is authenticated (you might want to add admin check here)
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

    // Get the titles to delete from query parameters
    const { searchParams } = new URL(request.url)
    const titles = searchParams.get('titles')?.split(',') || ['Demo', 'Demo1']
    
    // Build the SQL query to soft delete templates with specified titles
    const placeholders = titles.map(() => '?').join(',')
    const query = `
      UPDATE templates 
      SET deleted_at = ? 
      WHERE title IN (${placeholders}) AND deleted_at IS NULL
    `
    
    const params = [new Date().toISOString(), ...titles]
    
    // Execute the deletion
    const result = await executeQuery(query, params)
    
    // Count affected rows (note: this might not work in all D1 versions)
    const countQuery = `
      SELECT COUNT(*) as count 
      FROM templates 
      WHERE title IN (${placeholders}) AND deleted_at IS NOT NULL
    `
    const countResult = await executeQuery(countQuery, titles)
    const deletedCount = countResult[0]?.count || 0

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount} templates with titles: ${titles.join(', ')}`,
      deletedCount,
      deletedTitles: titles
    })
    
  } catch (error) {
    console.error('Error cleaning up templates:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CLEANUP_FAILED',
          message: 'Failed to cleanup templates',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check what would be deleted
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

    const { searchParams } = new URL(request.url)
    const titles = searchParams.get('titles')?.split(',') || ['Demo', 'Demo1']
    
    const placeholders = titles.map(() => '?').join(',')
    const query = `
      SELECT id, title, author, created_at, status
      FROM templates 
      WHERE title IN (${placeholders}) AND deleted_at IS NULL
    `
    
    const templates = await executeQuery(query, titles)
    
    return NextResponse.json({
      success: true,
      message: `Found ${templates.length} templates to be deleted`,
      templates,
      titles
    })
    
  } catch (error) {
    console.error('Error checking templates for cleanup:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CHECK_FAILED',
          message: 'Failed to check templates',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}