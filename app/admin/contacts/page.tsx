'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  User
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-text-primary">Contact Submissions</h1>
        <p className="text-text-muted mt-1">
          {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="Search messages..."
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
                All ({contacts.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </Button>
              <Button
                variant={filter === 'read' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('read')}
              >
                Read ({contacts.length - unreadCount})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Messages ({filteredContacts.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-16 w-16 mx-auto text-text-muted opacity-50" />
                <h3 className="mt-4 text-lg font-semibold text-text-primary">No messages</h3>
                <p className="text-text-muted mt-1">Contact form submissions will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-border-light max-h-[600px] overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedContact?.id === contact.id
                        ? 'bg-primary/5 border-l-4 border-primary'
                        : 'hover:bg-bg-secondary'
                    } ${!contact.isRead ? 'bg-blue-50/50' : ''}`}
                    onClick={() => {
                      setSelectedContact(contact)
                      if (!contact.isRead) markAsRead(contact.id)
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {contact.isRead ? (
                          <MailOpen className="h-5 w-5 text-text-muted" />
                        ) : (
                          <Mail className="h-5 w-5 text-primary" />
                        )}
                        <div>
                          <p className={`font-medium ${!contact.isRead ? 'text-primary' : 'text-text-primary'}`}>
                            {contact.name}
                          </p>
                          <p className="text-sm text-text-muted">{contact.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-text-muted">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </p>
                        {contact.isReplied && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                            <Check className="h-3 w-3" />
                            Replied
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-text-muted line-clamp-2">{contact.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Message Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedContact ? (
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-text-muted" />
                    <div>
                      <p className="text-sm text-text-muted">Name</p>
                      <p className="font-medium">{selectedContact.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-text-muted" />
                    <div>
                      <p className="text-sm text-text-muted">Email</p>
                      <a href={`mailto:${selectedContact.email}`} className="font-medium text-primary hover:underline">
                        {selectedContact.email}
                      </a>
                    </div>
                  </div>
                  {selectedContact.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-text-muted" />
                      <div>
                        <p className="text-sm text-text-muted">Phone</p>
                        <a href={`tel:${selectedContact.phone}`} className="font-medium text-primary hover:underline">
                          {selectedContact.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {selectedContact.service && (
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center text-text-muted">📋</span>
                      <div>
                        <p className="text-sm text-text-muted">Service Interest</p>
                        <p className="font-medium">{selectedContact.service}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-text-muted" />
                    <div>
                      <p className="text-sm text-text-muted">Received</p>
                      <p className="font-medium">
                        {new Date(selectedContact.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <p className="text-sm text-text-muted mb-2">Message</p>
                  <div className="bg-bg-secondary rounded-lg p-4">
                    <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-border-light">
                  <a href={`mailto:${selectedContact.email}`}>
                    <Button className="bg-primary hover:bg-primary-light">
                      <Mail className="h-4 w-4 mr-2" />
                      Reply via Email
                    </Button>
                  </a>
                  {!selectedContact.isReplied && (
                    <Button
                      variant="outline"
                      onClick={() => markAsReplied(selectedContact.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark as Replied
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
                    onClick={() => deleteContact(selectedContact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-text-muted">
                <Mail className="h-16 w-16 mx-auto opacity-50 mb-4" />
                <p>Select a message to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
