import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Filter, Search } from 'lucide-react'
import DocumentsTable from '@/components/client-portal/DocumentsTable'
import ClientPortalLayout from '@/components/client-portal/ClientPortalLayout'

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
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary">My Documents</h2>
          <p className="text-text-muted">Access and download your documents</p>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Document Library</CardTitle>
                <CardDescription>View and download your documents</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DocumentsTable userId={session.user?.id || ''} />
          </CardContent>
        </Card>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Tax Returns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-text-muted mt-1">Documents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                GST Returns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-text-muted mt-1">Documents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Audit Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-text-muted mt-1">Documents</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientPortalLayout>
  )
}
