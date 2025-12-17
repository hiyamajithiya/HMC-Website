'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Calendar,
  Download,
  TrendingUp,
  CheckCircle,
  Briefcase,
  ArrowRight,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  Shield,
  Users,
  BarChart3
} from 'lucide-react'
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

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary-dark rounded-2xl p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white/70 text-sm font-medium">{getGreeting()}</p>
              <h1 className="text-2xl sm:text-3xl font-bold mt-1">
                {profile?.name || session.user?.name || 'Welcome back'}!
              </h1>
              <p className="text-white/80 mt-2 max-w-lg">
                Your dashboard gives you a complete overview of your account, documents, and upcoming appointments.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/book-appointment">
                <Button className="bg-secondary hover:bg-secondary-dark text-white shadow-lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Documents</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  {loading ? '...' : profile?._count?.documents || 0}
                </p>
                <p className="text-xs text-slate-400 mt-1">Total files</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Appointments</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  {loading ? '...' : profile?.upcomingAppointments || 0}
                </p>
                <p className="text-xs text-slate-400 mt-1">Upcoming</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Services</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  {loading ? '...' : profile?.services?.length || 0}
                </p>
                <p className="text-xs text-slate-400 mt-1">Active</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Account</p>
                <p className="text-lg sm:text-xl font-bold text-green-600 mt-1">Active</p>
                <p className="text-xs text-slate-400 mt-1">Status</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Services Section */}
      {profile?.services && profile.services.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-lg">Your Active Services</CardTitle>
                <CardDescription>Services currently being provided to you</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {profile.services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{service}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/client-portal/documents" className="block">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">View Documents</p>
                    <p className="text-xs text-slate-500">Access your files</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </Link>

            <Link href="/book-appointment" className="block">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Book Appointment</p>
                    <p className="text-xs text-slate-500">Schedule a meeting</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </Link>

            <Link href="/client-portal/profile" className="block">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Edit Profile</p>
                    <p className="text-xs text-slate-500">Update your info</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Recent Documents</CardTitle>
                  <CardDescription>Your latest uploaded documents</CardDescription>
                </div>
              </div>
              <Link href="/client-portal/documents">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {profile?._count?.documents && profile._count.documents > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">You have {profile._count.documents} documents in your account.</p>
                <Link href="/client-portal/documents">
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View All Documents
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 mb-4">No documents uploaded yet</p>
                <Link href="/client-portal/documents">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact Section */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-50 to-white">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Need Assistance?</h3>
                <p className="text-slate-500 mt-1">
                  Our team is here to help you with any questions or concerns.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="tel:+919879503465">
                <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
                  <Phone className="h-4 w-4 mr-2 text-green-600" />
                  Call Us
                </Button>
              </a>
              <a href="mailto:info@himanshumajithiya.com">
                <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  Email Us
                </Button>
              </a>
              <Link href="/contact">
                <Button className="bg-primary hover:bg-primary-dark text-white">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
