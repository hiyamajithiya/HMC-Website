import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react'
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

  // Check if user is admin
  const isAdmin = session.user?.email === 'info@himanshumajithiya.com' ||
                  session.user?.email === 'admin@himanshumajithiya.com'

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <ClientPortalLayout userName={session.user?.name} userEmail={session.user?.email} isAdmin={isAdmin}>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">My Appointments</h2>
            <p className="text-text-muted">View and manage your scheduled appointments</p>
          </div>
          <Link href="/book-appointment">
            <Button className="bg-primary hover:bg-primary-light text-white">
              <Plus className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-text-muted">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-text-muted">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-text-muted">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Appointments</CardTitle>
            <CardDescription>View all your scheduled and past appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  No Appointments Yet
                </h3>
                <p className="text-text-muted mb-6 max-w-md mx-auto">
                  You haven&apos;t scheduled any appointments yet. Book a consultation with our expert Chartered Accountants.
                </p>
                <Link href="/book-appointment">
                  <Button className="bg-primary hover:bg-primary-light text-white">
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
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {getStatusIcon(appointment.status)}
                        <div>
                          <h4 className="font-semibold text-text-primary">
                            {appointment.service}
                          </h4>
                          <p className="text-sm text-text-muted">
                            {new Date(appointment.date).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-sm text-text-muted">
                            {appointment.timeSlot}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
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

        {/* Help Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-text-primary">Need to reschedule or cancel?</h3>
                <p className="text-sm text-text-muted">
                  Contact our office at least 24 hours before your appointment.
                </p>
              </div>
              <div className="flex gap-2">
                <a href="tel:+919879503465">
                  <Button variant="outline">Call Us</Button>
                </a>
                <a href="mailto:info@himanshumajithiya.com">
                  <Button variant="outline">Email Us</Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientPortalLayout>
  )
}
