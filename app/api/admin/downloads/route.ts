import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export const dynamic = 'force-dynamic'

// GET - Fetch all downloads
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const downloads = await prisma.download.findMany({
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(downloads)
  } catch (error) {
    console.error('Failed to fetch downloads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch downloads' },
      { status: 500 }
    )
  }
}

// POST - Create a new download (with file upload)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string
    const description = formData.get('description') as string | null
    const category = formData.get('category') as string
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0

    if (!file || !title || !category) {
      return NextResponse.json(
        { error: 'File, title, and category are required' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/zip',
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: PDF, Excel, Word, Text, ZIP' },
        { status: 400 }
      )
    }

    // Create downloads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'downloads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}-${sanitizedFileName}`
    const filePath = path.join(uploadsDir, fileName)

    // Write file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Determine file type display name
    const getFileTypeDisplay = (mimeType: string): string => {
      const typeMap: Record<string, string> = {
        'application/pdf': 'PDF',
        'application/vnd.ms-excel': 'Excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
        'application/msword': 'Word',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
        'text/plain': 'Text',
        'application/zip': 'ZIP',
      }
      return typeMap[mimeType] || 'File'
    }

    // Create download record
    const download = await prisma.download.create({
      data: {
        title,
        description: description || null,
        fileName: file.name,
        filePath: `/downloads/${fileName}`,
        fileSize: file.size,
        fileType: getFileTypeDisplay(file.type),
        category: category as any,
        sortOrder,
        isActive: true,
      }
    })

    return NextResponse.json(download, { status: 201 })
  } catch (error) {
    console.error('Failed to create download:', error)
    return NextResponse.json(
      { error: 'Failed to create download' },
      { status: 500 }
    )
  }
}
