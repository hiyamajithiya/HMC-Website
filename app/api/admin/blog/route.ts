import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// Helper to check admin status
async function checkAdmin() {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: 'Unauthorized', status: 401 }
  }

  const isAdmin = session.user.email === 'info@himanshumajithiya.com' ||
                  session.user.email === 'admin@himanshumajithiya.com'

  if (!isAdmin) {
    return { error: 'Forbidden', status: 403 }
  }

  return { session }
}

// GET all blog posts
export async function GET() {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// POST create new blog post
export async function POST(request: Request) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const body = await request.json()
    const { title, slug, excerpt, content, category, coverImage, tags, isPublished } = body

    // Validate required fields
    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: 'Title, excerpt, and content are required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const postSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: postSlug },
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      )
    }

    // Get the admin user
    const user = await prisma.user.findUnique({
      where: { email: adminCheck.session.user.email! },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: postSlug,
        excerpt,
        content,
        category: category || 'GENERAL',
        coverImage: coverImage || null,
        tags: tags || [],
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
        authorId: user.id,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Failed to create blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
