import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Helper to check admin status
async function checkAdmin() {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: 'Unauthorized', status: 401 }
  }

  if (session.user.role !== 'ADMIN') {
    return { error: 'Forbidden', status: 403 }
  }

  return { session }
}

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

    const leads = await prisma.downloadLead.findMany({
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
      total: await prisma.downloadLead.count(),
      verified: await prisma.downloadLead.count({ where: { verified: true } }),
      pending: await prisma.downloadLead.count({ where: { verified: false } }),
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

    await prisma.downloadLead.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Lead deleted successfully' })
  } catch (error) {
    console.error('Failed to delete lead:', error)
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
  }
}
