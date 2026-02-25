import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'
import { unlink, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export const dynamic = 'force-dynamic'

// Get uploads directory - use UPLOADS_PATH for persistent storage
function getArticlesDir(): string {
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
    if (storedPath.includes('/api/uploads/resources/')) {
      const fileName = storedPath.split('/').pop()
      return path.join(persistentPath, 'resources', fileName || '')
    }
    const fileName = storedPath.split('/').pop()
    return path.join(process.cwd(), 'public', 'downloads', fileName || '')
  }
  return path.join(process.cwd(), 'public', storedPath)
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET - Fetch single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession()
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

    const article = await prisma.article.findUnique({
      where: { id }
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Failed to fetch article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

// PATCH - Update article
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession()
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

    const existingArticle = await prisma.article.findUnique({
      where: { id }
    })

    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      const title = formData.get('title') as string
      const description = formData.get('description') as string | null
      const category = formData.get('category') as string
      const sortOrder = parseInt(formData.get('sortOrder') as string) || 0
      const isActive = formData.get('isActive') === 'true'

      // Update slug if title changed
      let slugUpdate: { slug?: string } = {}
      if (title && title !== existingArticle.title) {
        let newSlug = generateSlug(title)
        const existingSlug = await prisma.article.findFirst({ where: { slug: newSlug, id: { not: id } } })
        if (existingSlug) {
          newSlug = `${newSlug}-${Date.now()}`
        }
        slugUpdate = { slug: newSlug }
      }

      let updateData: any = {
        title: title || existingArticle.title,
        description: description !== undefined ? description : existingArticle.description,
        category: category || existingArticle.category,
        sortOrder,
        isActive,
        ...slugUpdate,
      }

      if (file && file.size > 0) {
        // Delete old file
        const oldFilePath = getFullFilePath(existingArticle.filePath)
        if (existsSync(oldFilePath)) {
          try {
            await unlink(oldFilePath)
          } catch (err) {
            console.warn('Could not delete old file:', err)
          }
        }

        // Save new file to persistent storage
        const uploadsDir = getArticlesDir()
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

      const article = await prisma.article.update({
        where: { id },
        data: updateData
      })

      return NextResponse.json(article)
    } else {
      const body = await request.json()
      const { title, description, category, sortOrder, isActive } = body

      // Update slug if title changed
      let slugUpdate: { slug?: string } = {}
      if (title && title !== existingArticle.title) {
        let newSlug = generateSlug(title)
        const existingSlug = await prisma.article.findFirst({ where: { slug: newSlug, id: { not: id } } })
        if (existingSlug) {
          newSlug = `${newSlug}-${Date.now()}`
        }
        slugUpdate = { slug: newSlug }
      }

      const article = await prisma.article.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description !== undefined && { description }),
          ...(category && { category }),
          ...(sortOrder !== undefined && { sortOrder }),
          ...(isActive !== undefined && { isActive }),
          ...slugUpdate,
        }
      })

      return NextResponse.json(article)
    }
  } catch (error) {
    console.error('Failed to update article:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

// DELETE - Delete article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession()
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

    const article = await prisma.article.findUnique({
      where: { id }
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Delete file from disk
    const filePath = getFullFilePath(article.filePath)
    if (existsSync(filePath)) {
      try {
        await unlink(filePath)
      } catch (err) {
        console.warn('Could not delete file:', err)
      }
    }

    // Delete from database
    await prisma.article.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete article:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}
