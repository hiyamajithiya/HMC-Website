import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'

// GET - Get folder details with contents
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const userRole = session.user.role

    const folder = await prisma.documentFolder.findUnique({
      where: { id },
      include: {
        children: {
          include: {
            _count: {
              select: {
                documents: true,
                children: true,
              },
            },
          },
          orderBy: { name: 'asc' },
        },
        documents: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        parent: true,
        user: {
          select: { name: true, email: true },
        },
      },
    })

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    // Check access
    if (userRole !== 'ADMIN' && userRole !== 'STAFF' && folder.userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json(folder)
  } catch (error) {
    console.error('Error fetching folder:', error)
    return NextResponse.json({ error: 'Failed to fetch folder' }, { status: 500 })
  }
}

// PATCH - Rename folder
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name } = body
    const userRole = session.user.role

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 })
    }

    const folder = await prisma.documentFolder.findUnique({
      where: { id },
    })

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    // Check access
    if (userRole !== 'ADMIN' && userRole !== 'STAFF' && folder.userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if a folder with the new name already exists at the same level
    const existingFolder = await prisma.documentFolder.findFirst({
      where: {
        name: name.trim(),
        parentId: folder.parentId,
        userId: folder.userId,
        id: { not: id },
      },
    })

    if (existingFolder) {
      return NextResponse.json({ error: 'A folder with this name already exists' }, { status: 400 })
    }

    const updatedFolder = await prisma.documentFolder.update({
      where: { id },
      data: { name: name.trim() },
      include: {
        _count: {
          select: {
            documents: true,
            children: true,
          },
        },
      },
    })

    return NextResponse.json(updatedFolder)
  } catch (error) {
    console.error('Error updating folder:', error)
    return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 })
  }
}

// DELETE - Delete folder and all contents
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const userRole = session.user.role

    const folder = await prisma.documentFolder.findUnique({
      where: { id },
      include: {
        documents: true,
        children: {
          include: {
            documents: true,
          },
        },
      },
    })

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    // Check access
    if (userRole !== 'ADMIN' && userRole !== 'STAFF' && folder.userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Delete the folder (cascade will handle children and set documents' folderId to null)
    await prisma.documentFolder.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Folder deleted successfully' })
  } catch (error) {
    console.error('Error deleting folder:', error)
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 })
  }
}
