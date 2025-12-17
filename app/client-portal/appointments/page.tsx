import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CalendarDays
} from 'lucide-react'
import Link from 'next/link'
import ClientPortalLayout from '@/components/client-portal/ClientPortalLayout'

export const metadata: Metadata = {
  title: 'Appointments | Client Portal',
  description: 'View and manage your appointments.',
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = 'force-dynamic'

export default async function AppointmentsPage() {
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

  // Mock appointments data - in production this would come from the database
  const appointments: any[] = []

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'PENDING':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <ClientPortalLayout userName={session.user?.name} userEmail={session.user?.email} isAdmin={false}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Appointments</h1>
            <p className="text-slate-500 mt-1">Schedule and manage your consultation appointments</p>
          </div>
          <Link href="/book-appointment">
            <Button className="bg-primary hover:bg-primary-dark text-white">
              <Plus className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">0</p>
                  <p className="text-sm text-slate-500">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">0</p>
                  <p className="text-sm text-slate-500">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">0</p>
                  <p className="text-sm text-slate-500">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Your Appointments</CardTitle>
                <CardDescription>View all your scheduled and past appointments</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No Appointments Yet
                </h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  You haven&apos;t scheduled any appointments yet. Book a consultation with our expert Chartered Accountants.
                </p>
                <Link href="/book-appointment">
                  <Button className="bg-primary hover:bg-primary-dark text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Book Your First Appointment
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-all"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          {getStatusIcon(appointment.status)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {appointment.service}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(appointment.date).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.timeSlot}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`inline-flex px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusStyle(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-50 to-white">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Need to reschedule or cancel?</h3>
                  <p className="text-slate-500 mt-1">
                    Contact our office at least 24 hours before your appointment.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="tel:+919879503465">
                  <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
                    <Phone className="h-4 w-4 mr-2 text-green-600" />
                    +91 98795 03465
                  </Button>
                </a>
                <a href="mailto:info@himanshumajithiya.com">
                  <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    Email Us
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Office Location */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Office Location</CardTitle>
                <CardDescription>Visit us for in-person consultations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <p className="text-slate-700 leading-relaxed">
                  <strong>Himanshu Majithiya & Co.</strong><br />
                  Chartered Accountants<br />
                  Varachha Road, Surat<br />
                  Gujarat - 395006, India
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>Mon - Sat: 10:00 AM - 7:00 PM</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Link href="/contact">
                  <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientPortalLayout>
  )
}
