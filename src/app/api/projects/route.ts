import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/projects - List all projects
export async function GET() {
  try {
    const projects = await db.project.findMany({
      include: {
        chapters: {
          orderBy: { index: 'asc' },
          include: {
            pages: {
              orderBy: { pageNumber: 'asc' }
            }
          }
        },
        owner: true
      },
      orderBy: { updatedAt: 'desc' }
    })
    
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const { name, description, sourceLang, targetLang, ownerId } = await request.json()
    
    if (!name || !ownerId) {
      return NextResponse.json(
        { error: 'Name and ownerId are required' },
        { status: 400 }
      )
    }
    
    // Create or find user
    let user = await db.user.findUnique({ where: { id: ownerId } })
    if (!user) {
      user = await db.user.create({
        data: {
          id: ownerId,
          email: `${ownerId}@example.com`,
          name: 'Demo User'
        }
      })
    }
    
    const project = await db.project.create({
      data: {
        name,
        description,
        sourceLang: sourceLang || 'ja',
        targetLang: targetLang || 'en',
        ownerId
      },
      include: {
        chapters: true
      }
    })
    
    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

// PUT /api/projects - Update a project
export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }
    
    const project = await db.project.update({
      where: { id },
      data: updates
    })
    
    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects - Delete a project
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }
    
    await db.project.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
