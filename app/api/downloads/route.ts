import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - Fetch all active downloads (public)
export async function GET() {
  try {
    const downloads = await prisma.download.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        title: true,
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
    const grouped = downloads.reduce((acc, download) => {
      const category = download.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(download)
      return acc
    }, {} as Record<string, typeof downloads>)

    return NextResponse.json({ downloads, grouped })
  } catch (error) {
    console.error('Failed to fetch downloads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch downloads' },
      { status: 500 }
    )
  }
}
