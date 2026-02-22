import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = session.user.role === 'ADMIN'

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
      totalDocuments,
      totalDownloads,
      recentUsers,
      recentContacts,
      recentDocuments,
      recentAppointments,
    ] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { isPublished: true } }),
      prisma.tool.count(),
      prisma.tool.count({ where: { isActive: true } }),
      prisma.contactSubmission.count({ where: { isRead: false } }),
      prisma.appointment.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.document.count(),
      prisma.download.count(),
      // Recent activities
      prisma.user.findMany({
        where: { role: 'CLIENT' },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { id: true, name: true, createdAt: true }
      }),
      prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { id: true, name: true, createdAt: true }
      }),
      prisma.document.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { id: true, title: true, createdAt: true }
      }),
      prisma.appointment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { id: true, name: true, status: true, createdAt: true }
      }),
    ])

    // Combine and sort recent activities
    const recentActivities = [
      ...recentUsers.map(u => ({
        type: 'user',
        text: `New user registered: ${u.name || 'Unknown'}`,
        time: u.createdAt,
        id: u.id
      })),
      ...recentContacts.map(c => ({
        type: 'contact',
        text: `New contact from: ${c.name}`,
        time: c.createdAt,
        id: c.id
      })),
      ...recentDocuments.map(d => ({
        type: 'document',
        text: `Document uploaded: ${d.title}`,
        time: d.createdAt,
        id: d.id
      })),
      ...recentAppointments.map(a => ({
        type: 'appointment',
        text: `Appointment ${a.status.toLowerCase()}: ${a.name}`,
        time: a.createdAt,
        id: a.id
      })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)

    return NextResponse.json({
      totalBlogPosts,
      publishedPosts,
      totalTools,
      activeTools,
      unreadContacts,
      pendingAppointments,
      totalUsers,
      totalDocuments,
      totalDownloads,
      recentActivities,
    })
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
