import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single tool by slug (public)
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const tool = await prisma.tool.findUnique({
      where: {
        slug: params.slug,
        isActive: true,
      },
    })

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(tool)
  } catch (error) {
    console.error('Failed to fetch tool:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tool' },
      { status: 500 }
    )
  }
}

// POST to increment download count
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const tool = await prisma.tool.update({
      where: {
        slug: params.slug,
        isActive: true,
      },
      data: {
        downloadCount: { increment: 1 },
      },
    })

    return NextResponse.json({ downloadCount: tool.downloadCount })
  } catch (error) {
    console.error('Failed to update download count:', error)
    return NextResponse.json(
      { error: 'Failed to update download count' },
      { status: 500 }
    )
  }
}
