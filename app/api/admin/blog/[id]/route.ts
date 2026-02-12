import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'
import { autoPostBlog } from '@/lib/social-poster'

export const dynamic = 'force-dynamic'

// GET single blog post
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { id } = await params

    const post = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Failed to fetch blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

// PUT update blog post
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { id } = await params
    const body = await request.json()
    const { title, slug, excerpt, content, category, coverImage, tags, isPublished, publishedAt } = body

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if new slug conflicts with another post
    if (slug && slug !== existingPost.slug) {
      const slugConflict = await prisma.blogPost.findUnique({
        where: { slug },
      })

      if (slugConflict) {
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: title ?? existingPost.title,
        slug: slug ?? existingPost.slug,
        excerpt: excerpt ?? existingPost.excerpt,
        content: content ?? existingPost.content,
        category: category ?? existingPost.category,
        coverImage: coverImage !== undefined ? coverImage : existingPost.coverImage,
        tags: tags ?? existingPost.tags,
        isPublished: isPublished ?? existingPost.isPublished,
        publishedAt: publishedAt ? new Date(publishedAt) : (isPublished && !existingPost.isPublished ? new Date() : existingPost.publishedAt),
      },
    })

    // Auto-post to social media on first publish (fire-and-forget)
    if (isPublished && !existingPost.isPublished) {
      autoPostBlog({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        tags: post.tags,
      }).catch(err => console.error('Auto-post failed:', err))
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Failed to update blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

// PATCH partial update blog post
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { id } = await params
    const body = await request.json()

    // Check if this is a publish action (need existing post to compare)
    const existingPost = body.isPublished !== undefined
      ? await prisma.blogPost.findUnique({ where: { id } })
      : null

    const post = await prisma.blogPost.update({
      where: { id },
      data: body,
    })

    // Auto-post to social media on first publish (fire-and-forget)
    if (body.isPublished && existingPost && !existingPost.isPublished) {
      autoPostBlog({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        tags: post.tags,
      }).catch(err => console.error('Auto-post failed:', err))
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Failed to update blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

// DELETE blog post
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { id } = await params

    await prisma.blogPost.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Failed to delete blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}
