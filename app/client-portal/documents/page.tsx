import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import ClientPortalLayout from '@/components/client-portal/ClientPortalLayout'
import ClientDocumentsContent from '@/components/client-portal/ClientDocumentsContent'

export const metadata: Metadata = {
  title: 'Documents | Client Portal',
  description: 'Access and manage your documents.',
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = 'force-dynamic'

export default async function DocumentsPage() {
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

  // Only CLIENT users see the client portal
  return (
    <ClientPortalLayout userName={session.user?.name} userEmail={session.user?.email} isAdmin={false}>
      <ClientDocumentsContent userId={session.user?.id || ''} />
    </ClientPortalLayout>
  )
}
