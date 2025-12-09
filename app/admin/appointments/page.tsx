'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Check,
  X,
  AlertCircle
} from 'lucide-react'

interface Appointment {
  id: string
  name: string
  email: string
  phone: string
  service: string
  date: string
  timeSlot: string
  message: string | null
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  createdAt: string
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  NO_SHOW: 'bg-gray-100 text-gray-700',
}

const statusLabels = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'CONFIRMED' | 'COMPLETED'>('all')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/admin/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        setAppointments(appointments.map((a) =>
          a.id === id ? { ...a, status: status as Appointment['status'] } : a
        ))
        if (selectedAppointment?.id === id) {
          setSelectedAppointment({ ...selectedAppointment, status: status as Appointment['status'] })
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const filteredAppointments = appointments
    .filter((apt) => {
      if (filter === 'all') return true
      return apt.status === filter
    })
    .filter((apt) =>
      apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const pendingCount = appointments.filter((a) => a.status === 'PENDING').length
  const todayCount = appointments.filter((a) => {
    const aptDate = new Date(a.date).toDateString()
    const today = new Date().toDateString()
    return aptDate === today && (a.status === 'PENDING' || a.status === 'CONFIRMED')
  }).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-text-primary">Appointments</h1>
        <p className="text-text-muted mt-1">
          {pendingCount > 0 ? `${pendingCount} pending confirmation` : 'All appointments confirmed'}
          {todayCount > 0 && ` • ${todayCount} scheduled for today`}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({appointments.length})
              </Button>
              <Button
                variant={filter === 'PENDING' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('PENDING')}
              >
                Pending ({appointments.filter((a) => a.status === 'PENDING').length})
              </Button>
              <Button
                variant={filter === 'CONFIRMED' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('CONFIRMED')}
              >
                Confirmed ({appointments.filter((a) => a.status === 'CONFIRMED').length})
              </Button>
              <Button
                variant={filter === 'COMPLETED' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('COMPLETED')}
              >
                Completed ({appointments.filter((a) => a.status === 'COMPLETED').length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Appointments ({filteredAppointments.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-text-muted opacity-50" />
                <h3 className="mt-4 text-lg font-semibold text-text-primary">No appointments</h3>
                <p className="text-text-muted mt-1">Appointment requests will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-border-light max-h-[600px] overflow-y-auto">
                {filteredAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedAppointment?.id === apt.id
                        ? 'bg-primary/5 border-l-4 border-primary'
                        : 'hover:bg-bg-secondary'
                    }`}
                    onClick={() => setSelectedAppointment(apt)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-text-primary">{apt.name}</p>
                          <p className="text-sm text-text-muted">{apt.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                          {statusLabels[apt.status]}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(apt.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {apt.timeSlot}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appointment Detail */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAppointment ? (
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedAppointment.status]}`}>
                    {selectedAppointment.status === 'PENDING' && <AlertCircle className="h-4 w-4" />}
                    {selectedAppointment.status === 'CONFIRMED' && <Check className="h-4 w-4" />}
                    {selectedAppointment.status === 'COMPLETED' && <Check className="h-4 w-4" />}
                    {selectedAppointment.status === 'CANCELLED' && <X className="h-4 w-4" />}
                    {statusLabels[selectedAppointment.status]}
                  </span>
                  <p className="text-sm text-text-muted">
                    Requested: {new Date(selectedAppointment.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-text-muted" />
                    <div>
                      <p className="text-sm text-text-muted">Name</p>
                      <p className="font-medium">{selectedAppointment.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-text-muted" />
                    <div>
                      <p className="text-sm text-text-muted">Email</p>
                      <a href={`mailto:${selectedAppointment.email}`} className="font-medium text-primary hover:underline">
                        {selectedAppointment.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-text-muted" />
                    <div>
                      <p className="text-sm text-text-muted">Phone</p>
                      <a href={`tel:${selectedAppointment.phone}`} className="font-medium text-primary hover:underline">
                        {selectedAppointment.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="space-y-3 pt-4 border-t border-border-light">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center text-text-muted">📋</span>
                    <div>
                      <p className="text-sm text-text-muted">Service</p>
                      <p className="font-medium">{selectedAppointment.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-text-muted" />
                    <div>
                      <p className="text-sm text-text-muted">Date</p>
                      <p className="font-medium">
                        {new Date(selectedAppointment.date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-text-muted" />
                    <div>
                      <p className="text-sm text-text-muted">Time Slot</p>
                      <p className="font-medium">{selectedAppointment.timeSlot}</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {selectedAppointment.message && (
                  <div className="pt-4 border-t border-border-light">
                    <p className="text-sm text-text-muted mb-2">Message</p>
                    <div className="bg-bg-secondary rounded-lg p-4">
                      <p className="whitespace-pre-wrap">{selectedAppointment.message}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border-light">
                  {selectedAppointment.status === 'PENDING' && (
                    <>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => updateStatus(selectedAppointment.id, 'CONFIRMED')}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => updateStatus(selectedAppointment.id, 'CANCELLED')}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}
                  {selectedAppointment.status === 'CONFIRMED' && (
                    <>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => updateStatus(selectedAppointment.id, 'COMPLETED')}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark Completed
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => updateStatus(selectedAppointment.id, 'NO_SHOW')}
                      >
                        No Show
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => updateStatus(selectedAppointment.id, 'CANCELLED')}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}
                  <a href={`mailto:${selectedAppointment.email}`} className="ml-auto">
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-text-muted">
                <Calendar className="h-16 w-16 mx-auto opacity-50 mb-4" />
                <p>Select an appointment to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
