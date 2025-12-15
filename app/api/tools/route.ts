import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET active tools (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const toolType = searchParams.get('type')

    const where = {
      isActive: true,
      ...(category && category !== 'all' ? { category: category as any } : {}),
      ...(toolType && toolType !== 'all' ? { toolType: toolType as any } : {}),
    }

    const tools = await prisma.tool.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        category: true,
        toolType: true,
        licenseType: true,
        price: true,
        downloadCount: true,
        version: true,
        features: true,
      },
    })

    return NextResponse.json(tools)
  } catch (error) {
    console.error('Failed to fetch tools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    )
  }
}
