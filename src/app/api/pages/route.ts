import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/pages - Get a specific page with text blocks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')
    const chapterId = searchParams.get('chapterId')
    
    if (pageId) {
      const page = await db.page.findUnique({
        where: { id: pageId },
        include: {
          blocks: {
            orderBy: { y: 'asc' }
          }
        }
      })
      
      if (!page) {
        return NextResponse.json(
          { error: 'Page not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ page })
    }
    
    if (chapterId) {
      const pages = await db.page.findMany({
        where: { chapterId },
        include: {
          blocks: true
        },
        orderBy: { pageNumber: 'asc' }
      })
      
      return NextResponse.json({ pages })
    }
    
    return NextResponse.json(
      { error: 'pageId or chapterId is required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    )
  }
}

// POST /api/pages - Create a new page
export async function POST(request: NextRequest) {
  try {
    const { 
      chapterId, 
      originalUrl, 
      pageNumber,
      width,
      height,
      blocks 
    } = await request.json()
    
    if (!chapterId || !originalUrl) {
      return NextResponse.json(
        { error: 'chapterId and originalUrl are required' },
        { status: 400 }
      )
    }
    
    // Get current max page number
    const maxPage = await db.page.findFirst({
      where: { chapterId },
      orderBy: { pageNumber: 'desc' },
      select: { pageNumber: true }
    })
    
    const page = await db.page.create({
      data: {
        chapterId,
        originalUrl,
        pageNumber: pageNumber ?? (maxPage?.pageNumber ?? 0) + 1,
        width: width ?? 0,
        height: height ?? 0,
        blocks: blocks ? {
          create: blocks.map((b: any) => ({
            sourceText: b.sourceText,
            targetText: b.targetText,
            x: b.x,
            y: b.y,
            width: b.width,
            height: b.height,
            rotation: b.rotation ?? 0,
            fontSize: b.fontSize ?? 16,
            fontFamily: b.fontFamily ?? 'Arial',
            fontWeight: b.fontWeight ?? 'normal',
            fontStyle: b.fontStyle ?? 'normal',
            textAlign: b.textAlign ?? 'center',
            fill: b.fill ?? '#000000',
            stroke: b.stroke,
            strokeWidth: b.strokeWidth ?? 0,
            confidence: b.confidence ?? 0,
            isLocked: b.isLocked ?? false,
            isVisible: b.isVisible ?? true,
          }))
        } : undefined
      },
      include: {
        blocks: true
      }
    })
    
    return NextResponse.json({ page })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    )
  }
}

// PUT /api/pages - Update a page or text blocks
export async function PUT(request: NextRequest) {
  try {
    const { pageId, pageUpdates, blocks } = await request.json()
    
    if (!pageId) {
      return NextResponse.json(
        { error: 'pageId is required' },
        { status: 400 }
      )
    }
    
    // Update page properties
    if (pageUpdates) {
      await db.page.update({
        where: { id: pageId },
        data: pageUpdates
      })
    }
    
    // Update text blocks
    if (blocks && Array.isArray(blocks)) {
      for (const block of blocks) {
        if (block.id) {
          await db.textBlock.update({
            where: { id: block.id },
            data: block
          })
        }
      }
    }
    
    const page = await db.page.findUnique({
      where: { id: pageId },
      include: { blocks: true }
    })
    
    return NextResponse.json({ page })
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    )
  }
}

// DELETE /api/pages - Delete a page
export async function DELETE(request: NextRequest) {
  try {
    const { pageId } = await request.json()
    
    if (!pageId) {
      return NextResponse.json(
        { error: 'pageId is required' },
        { status: 400 }
      )
    }
    
    await db.page.delete({
      where: { id: pageId }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    )
  }
}
