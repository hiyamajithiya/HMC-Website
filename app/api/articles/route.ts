import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - Fetch all active articles (public)
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        fileName: true,
        filePath: true,
        fileSize: true,
        fileType: true,
        category: true,
        downloadCount: true,
      }
    })

    // Group by category
    const grouped = articles.reduce((acc, article) => {
      const category = article.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(article)
      return acc
    }, {} as Record<string, typeof articles>)

    return NextResponse.json({ articles, grouped })
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}
