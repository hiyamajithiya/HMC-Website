import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - Get all download leads
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('toolId')
    const verified = searchParams.get('verified')

    // Build filter
    const where: any = {}
    if (toolId) {
      where.toolId = toolId
    }
    if (verified === 'true') {
      where.verified = true
    } else if (verified === 'false') {
      where.verified = false
    }

    const leads = await prisma.articleLead.findMany({
      where,
      include: {
        tool: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get stats
    const stats = {
      total: await prisma.articleLead.count(),
      verified: await prisma.articleLead.count({ where: { verified: true } }),
      pending: await prisma.articleLead.count({ where: { verified: false } }),
    }

    return NextResponse.json({ leads, stats })
  } catch (error) {
    console.error('Failed to fetch leads:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

// DELETE - Delete a lead
export async function DELETE(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 })
    }

    await prisma.articleLead.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Lead deleted successfully' })
  } catch (error) {
    console.error('Failed to delete lead:', error)
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
  }
}
