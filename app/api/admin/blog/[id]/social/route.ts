import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'
import { retryPostToSocial, manualPostToSocial } from '@/lib/social-poster'

export const dynamic = 'force-dynamic'

// GET social post logs for a blog post
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

    const logs = await prisma.socialPostLog.findMany({
      where: { blogPostId: id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Failed to fetch social post logs:', error)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}

// POST - Manual post to a specific platform
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { id } = await params
    const body = await request.json()
    const { platform } = body

    if (!platform || !['TWITTER', 'LINKEDIN', 'FACEBOOK', 'INSTAGRAM'].includes(platform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }

    const result = await manualPostToSocial(id, platform)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error('Manual post failed:', error)
    return NextResponse.json({ error: 'Failed to post' }, { status: 500 })
  }
}

// PUT - Retry a failed post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const body = await request.json()
    const { logId } = body

    if (!logId) {
      return NextResponse.json({ error: 'Log ID is required' }, { status: 400 })
    }

    const result = await retryPostToSocial(logId)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error('Retry failed:', error)
    return NextResponse.json({ error: 'Failed to retry' }, { status: 500 })
  }
}
