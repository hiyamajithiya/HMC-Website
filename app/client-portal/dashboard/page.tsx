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

  // Check if user is admin based on role from database
  const isAdmin = session.user?.role === 'ADMIN'

  return (
    <ClientPortalLayout
      userName={session.user?.name}
      userEmail={session.user?.email}
      isAdmin={isAdmin}
    >
      <ClientDashboardContent session={session} />
    </ClientPortalLayout>
  )
}
