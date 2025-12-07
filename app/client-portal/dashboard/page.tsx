import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, Download, User, Bell, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import ClientDashboardContent from '@/components/client-portal/ClientDashboardContent'

export const metadata: Metadata = {
  title: 'Dashboard | Client Portal',
  description: 'Your personal dashboard for managing documents and appointments.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/client-portal/login')
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <header className="bg-primary text-white border-b border-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-heading font-bold">Client Portal</h1>
              <p className="text-sm text-white/80">Welcome back, {session.user?.name || 'User'}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Bell className="h-5 w-5" />
              </Button>
              <form action={async () => {
                'use server'
                await signOut({ redirectTo: '/' })
              }}>
                <Button variant="ghost" size="sm" type="submit" className="text-white hover:bg-white/10">
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a
              href="/client-portal/dashboard"
              className="border-b-2 border-secondary py-4 px-1 text-sm font-medium text-secondary"
            >
              Dashboard
            </a>
            <a
              href="/client-portal/documents"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-text-muted hover:text-primary hover:border-border-light"
            >
              Documents
            </a>
            <a
              href="/client-portal/appointments"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-text-muted hover:text-primary hover:border-border-light"
            >
              Appointments
            </a>
            <a
              href="/client-portal/profile"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-text-muted hover:text-primary hover:border-border-light"
            >
              Profile
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClientDashboardContent session={session} />
      </main>
    </div>
  )
}
