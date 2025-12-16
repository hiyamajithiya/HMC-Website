'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, Download, TrendingUp, CheckCircle, Briefcase } from 'lucide-react'
import { Session } from 'next-auth'

interface ClientDashboardContentProps {
  session: Session
}

interface UserProfile {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  isActive: boolean
  services: string[]
  createdAt: string
  _count: {
    documents: number
    appointments: number
  }
  upcomingAppointments: number
}

export default function ClientDashboardContent({ session }: ClientDashboardContentProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : profile?._count?.documents || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : profile?.upcomingAppointments || 0}
            </div>
            <p className="text-xs text-muted-foreground">Upcoming appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : profile?.services?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Ongoing services</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Services Section */}
      {profile?.services && profile.services.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Your Active Services
            </CardTitle>
            <CardDescription>Services currently being provided to you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {profile.services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-green-800">{service}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Your latest uploaded documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No documents uploaded yet</p>
              <Button className="mt-4" variant="outline" asChild>
                <a href="/client-portal/documents">View Documents</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No upcoming appointments</p>
              <Button className="mt-4" variant="outline" asChild>
                <a href="/book-appointment">Book Appointment</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
              <a href="/client-portal/documents">
                <FileText className="h-6 w-6" />
                <span>View Documents</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
              <a href="/book-appointment">
                <Calendar className="h-6 w-6" />
                <span>Book Appointment</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
              <a href="/contact">
                <Download className="h-6 w-6" />
                <span>Contact Support</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile?.name || session.user?.name || 'Not set'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile?.email || session.user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile?.phone || 'Not set'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Account Status</dt>
              <dd className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </span>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
