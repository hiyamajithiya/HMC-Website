import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Helper to check admin status
async function checkAdmin() {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: 'Unauthorized', status: 401 }
  }

  const isAdmin = session.user.role === 'ADMIN'

  if (!isAdmin) {
    return { error: 'Forbidden', status: 403 }
  }

  return { session }
}

// GET single tool
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

    const tool = await prisma.tool.findUnique({
      where: { id },
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

// PUT update tool
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

    // Check if tool exists
    const existingTool = await prisma.tool.findUnique({
      where: { id },
    })

    if (!existingTool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    // Check if new slug conflicts with another tool
    if (slug && slug !== existingTool.slug) {
      const slugConflict = await prisma.tool.findUnique({
        where: { slug },
      })

      if (slugConflict) {
        return NextResponse.json(
          { error: 'A tool with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const tool = await prisma.tool.update({
      where: { id },
      data: {
        name: name ?? existingTool.name,
        slug: slug ?? existingTool.slug,
        shortDescription: shortDescription ?? existingTool.shortDescription,
        longDescription: longDescription ?? existingTool.longDescription,
        category: category ?? existingTool.category,
        toolType: toolType ?? existingTool.toolType,
        licenseType: licenseType ?? existingTool.licenseType,
        price: price !== undefined ? price : existingTool.price,
        downloadUrl: downloadUrl !== undefined ? downloadUrl : existingTool.downloadUrl,
        features: features ?? existingTool.features,
        requirements: requirements ?? existingTool.requirements,
        setupGuide: setupGuide !== undefined ? setupGuide : existingTool.setupGuide,
        version: version ?? existingTool.version,
        isActive: isActive ?? existingTool.isActive,
      },
    })

    return NextResponse.json(tool)
  } catch (error) {
    console.error('Failed to update tool:', error)
    return NextResponse.json(
      { error: 'Failed to update tool' },
      { status: 500 }
    )
  }
}

// PATCH partial update tool
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

    const tool = await prisma.tool.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(tool)
  } catch (error) {
    console.error('Failed to update tool:', error)
    return NextResponse.json(
      { error: 'Failed to update tool' },
      { status: 500 }
    )
  }
}

// DELETE tool
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

    await prisma.tool.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Tool deleted successfully' })
  } catch (error) {
    console.error('Failed to delete tool:', error)
    return NextResponse.json(
      { error: 'Failed to delete tool' },
      { status: 500 }
    )
  }
}
