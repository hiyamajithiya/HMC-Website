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

  // Check if user is admin based on role from database
  const isAdmin = session.user?.role === 'ADMIN'

  return (
    <ClientPortalLayout userName={session.user?.name} userEmail={session.user?.email} isAdmin={isAdmin}>
      <ClientDocumentsContent userId={session.user?.id || ''} />
    </ClientPortalLayout>
  )
}
