import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = session.user.email === 'info@himanshumajithiya.com' ||
                    session.user.email === 'admin@himanshumajithiya.com'

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch stats
    const [
      totalBlogPosts,
      publishedPosts,
      totalTools,
      activeTools,
      unreadContacts,
      pendingAppointments,
      totalUsers,
    ] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { isPublished: true } }),
      prisma.tool.count(),
      prisma.tool.count({ where: { isActive: true } }),
      prisma.contactSubmission.count({ where: { isRead: false } }),
      prisma.appointment.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
    ])

    return NextResponse.json({
      totalBlogPosts,
      publishedPosts,
      totalTools,
      activeTools,
      unreadContacts,
      pendingAppointments,
      totalUsers,
    })
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
