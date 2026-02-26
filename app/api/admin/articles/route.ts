import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { autoPostArticle } from '@/lib/social-poster'

export const dynamic = 'force-dynamic'

// Get uploads directory - use UPLOADS_PATH for persistent storage
function getArticlesDir(): string {
  const persistentPath = process.env.UPLOADS_PATH
  if (persistentPath) {
    return path.join(persistentPath, 'resources')
  }
  return path.join(process.cwd(), 'public', 'downloads')
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET - Fetch all articles
export async function GET() {
  try {
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

    const articles = await prisma.article.findMany({
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

// POST - Create a new article (with file upload)
export async function POST(request: NextRequest) {
  try {
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

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string
    const description = formData.get('description') as string | null
    const category = formData.get('category') as string
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0
    const coverImage = formData.get('coverImage') as string | null
    const socialImage = formData.get('socialImage') as string | null

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

    // Create uploads directory if it doesn't exist
    const uploadsDir = getArticlesDir()
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

    // Generate unique slug
    let slug = generateSlug(title)
    const existingSlug = await prisma.article.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    // Create article record
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        description: description || null,
        coverImage: coverImage || null,
        socialImage: socialImage || null,
        fileName: file.name,
        filePath: `/api/uploads/resources/${fileName}`,
        fileSize: file.size,
        fileType: getFileTypeDisplay(file.type),
        category: category as any,
        sortOrder,
        isActive: true,
      }
    })

    // Auto-post to social media
    if (article.isActive) {
      autoPostArticle({
        id: article.id,
        title: article.title,
        slug: article.slug,
        description: article.description,
        category: article.category,
        coverImage: article.coverImage,
        socialImage: article.socialImage,
      }).catch(err => console.error('Article auto-post failed:', err))
    }

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Failed to create article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}
