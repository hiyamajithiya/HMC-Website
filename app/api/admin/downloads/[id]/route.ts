import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { unlink, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export const dynamic = 'force-dynamic'

// Get uploads directory - use UPLOADS_PATH for persistent storage
function getDownloadsDir(): string {
  const persistentPath = process.env.UPLOADS_PATH
  if (persistentPath) {
    return path.join(persistentPath, 'resources')
  }
  return path.join(process.cwd(), 'public', 'downloads')
}

// Get full file path from stored path
function getFullFilePath(storedPath: string): string {
  const persistentPath = process.env.UPLOADS_PATH
  if (persistentPath) {
    // New format: /api/uploads/resources/filename
    if (storedPath.includes('/api/uploads/resources/')) {
      const fileName = storedPath.split('/').pop()
      return path.join(persistentPath, 'resources', fileName || '')
    }
    // Old format: /downloads/filename
    const fileName = storedPath.split('/').pop()
    return path.join(process.cwd(), 'public', 'downloads', fileName || '')
  }
  return path.join(process.cwd(), 'public', storedPath)
}

// GET - Fetch single download
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const download = await prisma.download.findUnique({
      where: { id }
    })

    if (!download) {
      return NextResponse.json({ error: 'Download not found' }, { status: 404 })
    }

    return NextResponse.json(download)
  } catch (error) {
    console.error('Failed to fetch download:', error)
    return NextResponse.json(
      { error: 'Failed to fetch download' },
      { status: 500 }
    )
  }
}

// PATCH - Update download
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const existingDownload = await prisma.download.findUnique({
      where: { id }
    })

    if (!existingDownload) {
      return NextResponse.json({ error: 'Download not found' }, { status: 404 })
    }

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload update
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      const title = formData.get('title') as string
      const description = formData.get('description') as string | null
      const category = formData.get('category') as string
      const sortOrder = parseInt(formData.get('sortOrder') as string) || 0
      const isActive = formData.get('isActive') === 'true'

      let updateData: any = {
        title: title || existingDownload.title,
        description: description !== undefined ? description : existingDownload.description,
        category: category || existingDownload.category,
        sortOrder,
        isActive,
      }

      if (file && file.size > 0) {
        // Delete old file
        const oldFilePath = getFullFilePath(existingDownload.filePath)
        if (existsSync(oldFilePath)) {
          try {
            await unlink(oldFilePath)
          } catch (err) {
            console.warn('Could not delete old file:', err)
          }
        }

        // Save new file to persistent storage
        const uploadsDir = getDownloadsDir()
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true })
        }

        const timestamp = Date.now()
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const fileName = `${timestamp}-${sanitizedFileName}`
        const filePath = path.join(uploadsDir, fileName)

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)

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

        updateData = {
          ...updateData,
          fileName: file.name,
          filePath: `/api/uploads/resources/${fileName}`,
          fileSize: file.size,
          fileType: getFileTypeDisplay(file.type),
        }
      }

      const download = await prisma.download.update({
        where: { id },
        data: updateData
      })

      return NextResponse.json(download)
    } else {
      // Handle JSON update (for simple field updates)
      const body = await request.json()
      const { title, description, category, sortOrder, isActive } = body

      const download = await prisma.download.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description !== undefined && { description }),
          ...(category && { category }),
          ...(sortOrder !== undefined && { sortOrder }),
          ...(isActive !== undefined && { isActive }),
        }
      })

      return NextResponse.json(download)
    }
  } catch (error) {
    console.error('Failed to update download:', error)
    return NextResponse.json(
      { error: 'Failed to update download' },
      { status: 500 }
    )
  }
}

// DELETE - Delete download
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const download = await prisma.download.findUnique({
      where: { id }
    })

    if (!download) {
      return NextResponse.json({ error: 'Download not found' }, { status: 404 })
    }

    // Delete file from disk
    const filePath = getFullFilePath(download.filePath)
    if (existsSync(filePath)) {
      try {
        await unlink(filePath)
      } catch (err) {
        console.warn('Could not delete file:', err)
      }
    }

    // Delete from database
    await prisma.download.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete download:', error)
    return NextResponse.json(
      { error: 'Failed to delete download' },
      { status: 500 }
    )
  }
}
