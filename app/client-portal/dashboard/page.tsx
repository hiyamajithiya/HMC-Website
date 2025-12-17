import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import ClientDashboardContent from '@/components/client-portal/ClientDashboardContent'
import ClientPortalLayout from '@/components/client-portal/ClientPortalLayout'

export const metadata: Metadata = {
  title: 'Dashboard | Client Portal',
  description: 'Your personal dashboard for managing documents and appointments.',
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/client-portal/login')
  }

  // Check user role
  const userRole = session.user?.role

  // Redirect ADMIN to admin dashboard
  if (userRole === 'ADMIN') {
    redirect('/admin')
  }

  // Redirect STAFF to admin documents (they have limited admin access)
  if (userRole === 'STAFF') {
    redirect('/admin/documents')
  }

  // Only CLIENT users see the client portal dashboard
  return (
    <ClientPortalLayout
      userName={session.user?.name}
      userEmail={session.user?.email}
      isAdmin={false}
    >
      <ClientDashboardContent session={session} />
    </ClientPortalLayout>
  )
}
