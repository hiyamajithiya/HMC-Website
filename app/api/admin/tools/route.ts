import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET all tools
export async function GET() {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const tools = await prisma.tool.findMany({
      orderBy: { createdAt: 'desc' },
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

// POST create new tool
export async function POST(request: Request) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const body = await request.json()
    const {
      name,
      slug,
      shortDescription,
      longDescription,
      category,
      toolType,
      licenseType,
      price,
      downloadUrl,
      features,
      requirements,
      setupGuide,
      version,
      isActive,
    } = body

    // Validate required fields
    if (!name || !shortDescription) {
      return NextResponse.json(
        { error: 'Name and short description are required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const toolSlug = slug || name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingTool = await prisma.tool.findUnique({
      where: { slug: toolSlug },
    })

    if (existingTool) {
      return NextResponse.json(
        { error: 'A tool with this slug already exists' },
        { status: 400 }
      )
    }

    const tool = await prisma.tool.create({
      data: {
        name,
        slug: toolSlug,
        shortDescription,
        longDescription: longDescription || '',
        category: category || 'OTHER',
        toolType: toolType || 'WEB_APP',
        licenseType: licenseType || 'FREE',
        price: price || null,
        downloadUrl: downloadUrl || null,
        features: features || [],
        requirements: requirements || [],
        setupGuide: setupGuide || null,
        version: version || '1.0.0',
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(tool, { status: 201 })
  } catch (error) {
    console.error('Failed to create tool:', error)
    return NextResponse.json(
      { error: 'Failed to create tool' },
      { status: 500 }
    )
  }
}
