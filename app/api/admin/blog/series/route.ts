import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET distinct series names
export async function GET() {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const posts = await prisma.blogPost.findMany({
      where: {
        seriesName: { not: null },
      },
      select: {
        seriesName: true,
      },
      distinct: ['seriesName'],
      orderBy: { seriesName: 'asc' },
    })

    const seriesNames = posts
      .map(p => p.seriesName)
      .filter((name): name is string => name !== null)

    return NextResponse.json(seriesNames)
  } catch (error) {
    console.error('Failed to fetch series names:', error)
    return NextResponse.json(
      { error: 'Failed to fetch series names' },
      { status: 500 }
    )
  }
}
