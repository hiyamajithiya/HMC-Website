'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  AlertCircle,
  CalendarDays,
  CheckCircle,
  XCircle,
  Briefcase,
  MessageSquare
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
  PENDING: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border border-blue-200',
  COMPLETED: 'bg-green-50 text-green-700 border border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border border-red-200',
  NO_SHOW: 'bg-slate-50 text-slate-700 border border-slate-200',
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
  const confirmedCount = appointments.filter((a) => a.status === 'CONFIRMED').length
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length
  const todayCount = appointments.filter((a) => {
    const aptDate = new Date(a.date).toDateString()
    const today = new Date().toDateString()
    return aptDate === today && (a.status === 'PENDING' || a.status === 'CONFIRMED')
  }).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Appointments</h1>
        <p className="text-slate-500 mt-1">
          {pendingCount > 0 ? `${pendingCount} pending confirmation` : 'All appointments confirmed'}
          {todayCount > 0 && ` • ${todayCount} scheduled for today`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{appointments.length}</p>
                <p className="text-sm text-slate-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
                <p className="text-sm text-slate-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{confirmedCount}</p>
                <p className="text-sm text-slate-500">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{completedCount}</p>
                <p className="text-sm text-slate-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({appointments.length})
              </button>
              <button
                onClick={() => setFilter('PENDING')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === 'PENDING' ? 'bg-white text-yellow-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter('CONFIRMED')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === 'CONFIRMED' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Confirmed ({confirmedCount})
              </button>
              <button
                onClick={() => setFilter('COMPLETED')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === 'COMPLETED' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Appointments List */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Appointments</CardTitle>
                <CardDescription>{filteredAppointments.length} appointments found</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary/20 rounded-full border-t-primary animate-spin mx-auto"></div>
                  <p className="mt-4 text-slate-500">Loading appointments...</p>
                </div>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No appointments</h3>
                <p className="text-slate-500 mt-1">Appointment requests will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {filteredAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedAppointment?.id === apt.id
                        ? 'bg-primary/5 border-l-4 border-primary'
                        : 'hover:bg-slate-50 border-l-4 border-transparent'
                    }`}
                    onClick={() => setSelectedAppointment(apt)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          apt.status === 'PENDING' ? 'bg-yellow-100' :
                          apt.status === 'CONFIRMED' ? 'bg-blue-100' :
                          apt.status === 'COMPLETED' ? 'bg-green-100' : 'bg-slate-100'
                        }`}>
                          {apt.status === 'PENDING' && <AlertCircle className="h-5 w-5 text-yellow-600" />}
                          {apt.status === 'CONFIRMED' && <CheckCircle className="h-5 w-5 text-blue-600" />}
                          {apt.status === 'COMPLETED' && <Check className="h-5 w-5 text-green-600" />}
                          {apt.status === 'CANCELLED' && <XCircle className="h-5 w-5 text-red-600" />}
                          {apt.status === 'NO_SHOW' && <X className="h-5 w-5 text-slate-600" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900 truncate">{apt.name}</p>
                          <p className="text-sm text-slate-500 truncate">{apt.service}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-slate-400">
                          {new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[apt.status]}`}>
                          {statusLabels[apt.status]}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-slate-500 pl-[52px]">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
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
        <Card className="border-0 shadow-sm lg:col-span-3">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-lg">Appointment Details</CardTitle>
                <CardDescription>View and manage appointments</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedAppointment ? (
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${statusColors[selectedAppointment.status]}`}>
                    {selectedAppointment.status === 'PENDING' && <AlertCircle className="h-4 w-4" />}
                    {selectedAppointment.status === 'CONFIRMED' && <CheckCircle className="h-4 w-4" />}
                    {selectedAppointment.status === 'COMPLETED' && <Check className="h-4 w-4" />}
                    {selectedAppointment.status === 'CANCELLED' && <XCircle className="h-4 w-4" />}
                    {statusLabels[selectedAppointment.status]}
                  </span>
                  <p className="text-sm text-slate-500">
                    Requested: {new Date(selectedAppointment.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Name</p>
                      <p className="text-sm font-medium text-slate-900 truncate mt-0.5">{selectedAppointment.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</p>
                      <a href={`mailto:${selectedAppointment.email}`} className="text-sm font-medium text-primary hover:underline truncate block mt-0.5">
                        {selectedAppointment.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone</p>
                      <a href={`tel:${selectedAppointment.phone}`} className="text-sm font-medium text-primary hover:underline mt-0.5 block">
                        {selectedAppointment.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Briefcase className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Service</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedAppointment.service}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Calendar className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">
                        {new Date(selectedAppointment.date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Clock className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Time Slot</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedAppointment.timeSlot}</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {selectedAppointment.message && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="h-4 w-4 text-slate-400" />
                      <p className="text-sm font-medium text-slate-700">Message</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                      <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{selectedAppointment.message}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                  {selectedAppointment.status === 'PENDING' && (
                    <>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => updateStatus(selectedAppointment.id, 'CONFIRMED')}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
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
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => updateStatus(selectedAppointment.id, 'COMPLETED')}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark Completed
                      </Button>
                      <Button
                        variant="outline"
                        className="border-slate-200"
                        onClick={() => updateStatus(selectedAppointment.id, 'NO_SHOW')}
                      >
                        No Show
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => updateStatus(selectedAppointment.id, 'CANCELLED')}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}
                  <a href={`mailto:${selectedAppointment.email}`} className="ml-auto">
                    <Button variant="outline" className="border-slate-200">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No appointment selected</h3>
                <p className="text-slate-500">Select an appointment from the list to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
