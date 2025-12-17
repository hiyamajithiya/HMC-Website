import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { User, Mail, Phone, Calendar, Shield, Key, Building2, Clock } from 'lucide-react'
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
      createdAt: true,
      services: true,
      group: {
        select: {
          name: true
        }
      }
    }
  }) : null

  // Get first letter for avatar
  const avatarLetter = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'

  return (
    <ClientPortalLayout userName={session.user?.name} userEmail={session.user?.email} isAdmin={false}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your account information and security settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-3xl font-bold text-white">{avatarLetter}</span>
                  </div>

                  {/* Name */}
                  <h2 className="text-xl font-bold text-slate-900">
                    {session?.user?.name || 'Client'}
                  </h2>

                  {/* Login ID */}
                  {user?.loginId && (
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mt-2">
                      <Key className="h-4 w-4" />
                      <span className="font-mono">{user.loginId}</span>
                    </div>
                  )}

                  {/* Email */}
                  <p className="text-sm text-slate-500 mt-1">{session?.user?.email}</p>

                  {/* Status Badge */}
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    <Shield className="h-4 w-4" />
                    Active Account
                  </div>

                  {/* Group */}
                  {user?.group?.name && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span>{user.group.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-sm mt-4">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Active Services</span>
                    <span className="text-lg font-bold text-slate-900">{user?.services?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Member Since</span>
                    <span className="text-sm font-medium text-slate-700">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Account Information</CardTitle>
                    <CardDescription>Your basic account details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Full Name</p>
                      <p className="text-sm font-medium text-slate-900 truncate mt-0.5">
                        {session?.user?.name || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  {user?.loginId && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <Key className="h-5 w-5 text-slate-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Login ID</p>
                        <p className="text-sm font-medium text-slate-900 font-mono mt-0.5">{user.loginId}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email Address</p>
                      <p className="text-sm font-medium text-slate-900 truncate mt-0.5">
                        {session?.user?.email || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone Number</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">
                        {user?.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  {user?.dateOfBirth && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <Calendar className="h-5 w-5 text-slate-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date of Birth / Inc.</p>
                        <p className="text-sm font-medium text-slate-900 mt-0.5">
                          {new Date(user.dateOfBirth).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Clock className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Member Since</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'Not available'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Security Settings</CardTitle>
                    <CardDescription>Manage your password and security preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ChangePasswordForm />
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Need Help?</p>
                      <p className="text-sm text-blue-700 mt-1">
                        If you forgot your password or need assistance, please contact our office at{' '}
                        <a href="mailto:info@himanshumajithiya.com" className="font-medium underline">
                          info@himanshumajithiya.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support Card */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-50 to-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Contact Support</CardTitle>
                    <CardDescription>Get in touch with our team</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="tel:+919879503465"
                    className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-green-300 hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Call Us</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">+91 98795 03465</p>
                    </div>
                  </a>
                  <a
                    href="mailto:info@himanshumajithiya.com"
                    className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email Us</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">info@himanshumajithiya.com</p>
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
