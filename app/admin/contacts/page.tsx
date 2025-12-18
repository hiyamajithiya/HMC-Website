'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Mail,
  MailOpen,
  Check,
  Trash2,
  Phone,
  Clock,
  User,
  Inbox,
  CheckCircle,
  XCircle,
  MessageSquare,
  Reply,
  Briefcase,
  Calendar
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  service: string | null
  message: string
  isRead: boolean
  isReplied: boolean
  createdAt: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/contacts')
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })
      if (response.ok) {
        setContacts(contacts.map((c) =>
          c.id === id ? { ...c, isRead: true } : c
        ))
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAsReplied = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isReplied: true, isRead: true }),
      })
      if (response.ok) {
        setContacts(contacts.map((c) =>
          c.id === id ? { ...c, isReplied: true, isRead: true } : c
        ))
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, isReplied: true, isRead: true })
        }
      }
    } catch (error) {
      console.error('Failed to mark as replied:', error)
    }
  }

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setContacts(contacts.filter((c) => c.id !== id))
        if (selectedContact?.id === id) {
          setSelectedContact(null)
        }
      }
    } catch (error) {
      console.error('Failed to delete contact:', error)
    }
  }

  const filteredContacts = contacts
    .filter((contact) => {
      if (filter === 'unread') return !contact.isRead
      if (filter === 'read') return contact.isRead
      return true
    })
    .filter((contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const unreadCount = contacts.filter((c) => !c.isRead).length
  const repliedCount = contacts.filter((c) => c.isReplied).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Contact Messages</h1>
        <p className="text-slate-500 mt-1">Manage and respond to form submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Inbox className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{contacts.length}</p>
                <p className="text-sm text-slate-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{unreadCount}</p>
                <p className="text-sm text-slate-500">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{repliedCount}</p>
                <p className="text-sm text-slate-500">Replied</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{contacts.length - repliedCount}</p>
                <p className="text-sm text-slate-500">Pending</p>
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
                placeholder="Search by name, email, or message..."
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
                All ({contacts.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === 'unread' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === 'read' ? 'bg-white text-slate-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Read ({contacts.length - unreadCount})
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Messages List */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Inbox</CardTitle>
                <CardDescription>{filteredContacts.length} messages</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary/20 rounded-full border-t-primary animate-spin mx-auto"></div>
                  <p className="mt-4 text-slate-500">Loading messages...</p>
                </div>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Inbox className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No messages</h3>
                <p className="text-slate-500 mt-1">Contact submissions will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedContact?.id === contact.id
                        ? 'bg-primary/5 border-l-4 border-primary'
                        : 'hover:bg-slate-50 border-l-4 border-transparent'
                    } ${!contact.isRead ? 'bg-blue-50/50' : ''}`}
                    onClick={() => {
                      setSelectedContact(contact)
                      if (!contact.isRead) markAsRead(contact.id)
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          !contact.isRead ? 'bg-blue-100' : 'bg-slate-100'
                        }`}>
                          {contact.isRead ? (
                            <MailOpen className="h-5 w-5 text-slate-400" />
                          ) : (
                            <Mail className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`font-medium truncate ${!contact.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                            {contact.name}
                          </p>
                          <p className="text-sm text-slate-500 truncate">{contact.email}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-slate-400">
                          {new Date(contact.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                        {contact.isReplied && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1 bg-green-50 px-2 py-0.5 rounded-full">
                            <Check className="h-3 w-3" />
                            Replied
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-500 line-clamp-2 pl-[52px]">{contact.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card className="border-0 shadow-sm lg:col-span-3">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-lg">Message Details</CardTitle>
                <CardDescription>View and respond to messages</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedContact ? (
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Name</p>
                      <p className="text-sm font-medium text-slate-900 truncate mt-0.5">{selectedContact.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</p>
                      <a href={`mailto:${selectedContact.email}`} className="text-sm font-medium text-primary hover:underline truncate block mt-0.5">
                        {selectedContact.email}
                      </a>
                    </div>
                  </div>

                  {selectedContact.phone && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <Phone className="h-5 w-5 text-slate-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone</p>
                        <a href={`tel:${selectedContact.phone}`} className="text-sm font-medium text-primary hover:underline mt-0.5 block">
                          {selectedContact.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedContact.service && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <Briefcase className="h-5 w-5 text-slate-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Service Interest</p>
                        <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedContact.service}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Calendar className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Received</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">
                        {new Date(selectedContact.createdAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      {selectedContact.isReplied ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-orange-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</p>
                      <p className={`text-sm font-medium mt-0.5 ${selectedContact.isReplied ? 'text-green-600' : 'text-orange-600'}`}>
                        {selectedContact.isReplied ? 'Replied' : 'Awaiting Response'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">Message Content</p>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{selectedContact.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                  <a href={`mailto:${selectedContact.email}`}>
                    <Button className="bg-primary hover:bg-primary-dark text-white">
                      <Reply className="h-4 w-4 mr-2" />
                      Reply via Email
                    </Button>
                  </a>
                  {!selectedContact.isReplied && (
                    <Button
                      variant="outline"
                      onClick={() => markAsReplied(selectedContact.id)}
                      className="border-green-200 text-green-600 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark as Replied
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 ml-auto"
                    onClick={() => deleteContact(selectedContact.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No message selected</h3>
                <p className="text-slate-500">Select a message from the inbox to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
