import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'
import { autoPostTool } from '@/lib/social-poster'

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
        iconImage: body.iconImage || null,
      },
    })

    // Auto-post to social media if tool is active (fire-and-forget)
    if (tool.isActive) {
      autoPostTool({
        id: tool.id,
        name: tool.name,
        slug: tool.slug,
        shortDescription: tool.shortDescription,
        features: tool.features,
        category: tool.category,
        iconImage: tool.iconImage,
      }).catch(err => console.error('Tool auto-post failed:', err))
    }

    return NextResponse.json(tool, { status: 201 })
  } catch (error) {
    console.error('Failed to create tool:', error)
    return NextResponse.json(
      { error: 'Failed to create tool' },
      { status: 500 }
    )
  }
}
