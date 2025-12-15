import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/auth'
import { User, Mail, Phone, Calendar, Shield, LogOut, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Profile | Client Portal',
  description: 'Manage your account settings and profile information.',
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
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
              <h1 className="text-2xl font-heading font-bold">My Profile</h1>
              <p className="text-sm text-white/80">Manage your account settings</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/client-portal/dashboard"
                className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <form action={async () => {
                'use server'
                await signOut({ redirectTo: '/client-portal/login' })
              }}>
                <Button
                  variant="outline"
                  size="sm"
                  type="submit"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-text-primary">
                    {session?.user?.name || 'Client'}
                  </h2>
                  <p className="text-sm text-text-muted">{session?.user?.email}</p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    <Shield className="h-4 w-4" />
                    Active Account
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your basic account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-bg-secondary rounded-lg">
                  <User className="h-5 w-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">Full Name</p>
                    <p className="font-medium">{session?.user?.name || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-bg-secondary rounded-lg">
                  <Mail className="h-5 w-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">Email Address</p>
                    <p className="font-medium">{session?.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-bg-secondary rounded-lg">
                  <Phone className="h-5 w-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">Phone Number</p>
                    <p className="font-medium">Contact office to update</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-bg-secondary rounded-lg">
                  <Calendar className="h-5 w-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">Member Since</p>
                    <p className="font-medium">Contact office for details</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Password Reset</p>
                      <p className="text-sm text-blue-700 mt-1">
                        To reset your password or update security settings, please contact our office at{' '}
                        <a href="mailto:info@himanshumajithiya.com" className="underline">
                          info@himanshumajithiya.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Contact our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="tel:+919879503465"
                    className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg hover:bg-bg-tertiary transition-colors"
                  >
                    <Phone className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm text-text-muted">Call Us</p>
                      <p className="font-medium">+91 98795 03465</p>
                    </div>
                  </a>
                  <a
                    href="mailto:info@himanshumajithiya.com"
                    className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg hover:bg-bg-tertiary transition-colors"
                  >
                    <Mail className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm text-text-muted">Email Us</p>
                      <p className="font-medium">info@himanshumajithiya.com</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
