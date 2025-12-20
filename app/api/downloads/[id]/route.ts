import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST - Increment download count when file is downloaded
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const download = await prisma.download.findUnique({
      where: { id }
    })

    if (!download) {
      return NextResponse.json({ error: 'Download not found' }, { status: 404 })
    }

    // Increment download count
    await prisma.download.update({
      where: { id },
      data: {
        downloadCount: { increment: 1 }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to track download:', error)
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    )
  }
}
