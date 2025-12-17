import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch folders for a user
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const parentId = searchParams.get('parentId')

    const userRole = session.user.role

    // Determine which user's folders to fetch
    let targetUserId: string
    if (userRole === 'ADMIN' || userRole === 'STAFF') {
      targetUserId = userId || session.user.id
    } else {
      targetUserId = session.user.id
    }

    // Fetch folders
    const folders = await prisma.documentFolder.findMany({
      where: {
        userId: targetUserId,
        parentId: parentId || null,
      },
      include: {
        _count: {
          select: {
            documents: true,
            children: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(folders)
  } catch (error) {
    console.error('Error fetching folders:', error)
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 })
  }
}

// POST - Create a new folder
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, parentId, userId } = body

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 })
    }

    const userRole = session.user.role

    // Determine target user
    let targetUserId: string
    if ((userRole === 'ADMIN' || userRole === 'STAFF') && userId) {
      targetUserId = userId
    } else {
      targetUserId = session.user.id
    }

    // If parentId is provided, verify it belongs to the same user
    if (parentId) {
      const parentFolder = await prisma.documentFolder.findUnique({
        where: { id: parentId },
      })

      if (!parentFolder || parentFolder.userId !== targetUserId) {
        return NextResponse.json({ error: 'Invalid parent folder' }, { status: 400 })
      }
    }

    // Check if folder with same name already exists in same location
    const existingFolder = await prisma.documentFolder.findFirst({
      where: {
        name: name.trim(),
        parentId: parentId || null,
        userId: targetUserId,
      },
    })

    if (existingFolder) {
      return NextResponse.json({ error: 'A folder with this name already exists' }, { status: 400 })
    }

    // Create the folder
    const folder = await prisma.documentFolder.create({
      data: {
        name: name.trim(),
        parentId: parentId || null,
        userId: targetUserId,
      },
      include: {
        _count: {
          select: {
            documents: true,
            children: true,
          },
        },
      },
    })

    return NextResponse.json(folder, { status: 201 })
  } catch (error) {
    console.error('Error creating folder:', error)
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 })
  }
}
