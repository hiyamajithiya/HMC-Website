import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { User, Mail, Phone, Calendar, Shield, Key } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ClientPortalLayout from '@/components/client-portal/ClientPortalLayout'
import ChangePasswordForm from '@/components/client-portal/ChangePasswordForm'
import { prisma } from '@/lib/prisma'

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

  // Get full user details from database
  const user = session.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      loginId: true,
      phone: true,
      dateOfBirth: true,
      createdAt: true
    }
  }) : null

  return (
    <ClientPortalLayout userName={session.user?.name} userEmail={session.user?.email} isAdmin={false}>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary">My Profile</h2>
          <p className="text-text-muted">Manage your account settings</p>
        </div>

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
                  {user?.loginId && (
                    <div className="flex items-center justify-center gap-1 text-sm text-text-muted mt-1">
                      <Key className="h-3 w-3" />
                      <span>{user.loginId}</span>
                    </div>
                  )}
                  <p className="text-sm text-text-muted mt-1">{session?.user?.email}</p>
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
                {user?.loginId && (
                  <div className="flex items-center gap-4 p-3 bg-bg-secondary rounded-lg">
                    <Key className="h-5 w-5 text-text-muted" />
                    <div>
                      <p className="text-sm text-text-muted">Login ID</p>
                      <p className="font-medium">{user.loginId}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 p-3 bg-bg-secondary rounded-lg">
                  <Mail className="h-5 w-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">Email Address</p>
                    <p className="font-medium">{session?.user?.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-bg-secondary rounded-lg">
                  <Phone className="h-5 w-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">Phone Number</p>
                    <p className="font-medium">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
                {user?.dateOfBirth && (
                  <div className="flex items-center gap-4 p-3 bg-bg-secondary rounded-lg">
                    <Calendar className="h-5 w-5 text-text-muted" />
                    <div>
                      <p className="text-sm text-text-muted">Date of Birth / Incorporation</p>
                      <p className="font-medium">{new Date(user.dateOfBirth).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 p-3 bg-bg-secondary rounded-lg">
                  <Calendar className="h-5 w-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">Member Since</p>
                    <p className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'Not available'}</p>
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
              <CardContent className="space-y-4">
                <ChangePasswordForm />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Need Help?</p>
                      <p className="text-sm text-blue-700 mt-1">
                        If you forgot your password or need assistance, please contact our office at{' '}
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
                    className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Phone className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm text-text-muted">Call Us</p>
                      <p className="font-medium">+91 98795 03465</p>
                    </div>
                  </a>
                  <a
                    href="mailto:info@himanshumajithiya.com"
                    className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg hover:bg-gray-100 transition-colors"
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
      </div>
    </ClientPortalLayout>
  )
}
