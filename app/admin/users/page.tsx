'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Search,
  UserPlus,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldOff,
  Check,
  X,
  Edit,
  Briefcase,
  Users,
  Key
} from 'lucide-react'

// Available services that can be offered to clients
const AVAILABLE_SERVICES = [
  'Income Tax Filing',
  'GST Registration & Compliance',
  'Company Registration',
  'Audit & Assurance',
  'Business Consultation',
  'Financial Advisory',
  'TDS Returns',
  'ROC Compliance',
  'FFMC/RBI Compliance',
  'Payroll Management',
  'Bookkeeping',
  'Project Finance'
]

interface ClientGroup {
  id: string
  name: string
}

interface UserData {
  id: string
  name: string | null
  email: string | null
  loginId: string | null
  phone: string | null
  dateOfBirth: string | null
  role: 'ADMIN' | 'CLIENT'
  isActive: boolean
  services: string[]
  groupId: string | null
  group: ClientGroup | null
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [groups, setGroups] = useState<ClientGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'ADMIN' | 'CLIENT'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [addingUser, setAddingUser] = useState(false)
  const [updatingUser, setUpdatingUser] = useState(false)
  const [addError, setAddError] = useState('')
  const [editError, setEditError] = useState('')
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    role: 'CLIENT' as 'ADMIN' | 'CLIENT',
    services: [] as string[],
    groupId: '',
    newGroupName: ''
  })

  useEffect(() => {
    fetchUsers()
    fetchGroups()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/admin/groups')
      if (response.ok) {
        const data = await response.json()
        setGroups(data)
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error)
    }
  }

  const toggleUserStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      if (response.ok) {
        setUsers(users.map((u) => (u.id === id ? { ...u, isActive: !isActive } : u)))
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingUser(true)
    setAddError('')

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user')
      }

      // Add new user to the list
      setUsers([data, ...users])

      // Refresh groups in case a new one was created
      fetchGroups()

      // Reset form and close modal
      setNewUser({ name: '', email: '', phone: '', dateOfBirth: '', role: 'CLIENT', services: [], groupId: '', newGroupName: '' })
      setShowAddModal(false)
    } catch (error) {
      setAddError(error instanceof Error ? error.message : 'Failed to create user')
    } finally {
      setAddingUser(false)
    }
  }

  // State for editing user's new group name
  const [editNewGroupName, setEditNewGroupName] = useState('')

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setUpdatingUser(true)
    setEditError('')

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingUser.name,
          phone: editingUser.phone,
          role: editingUser.role,
          services: editingUser.services,
          groupId: editingUser.groupId,
          newGroupName: editNewGroupName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user')
      }

      // Update user in the list
      setUsers(users.map((u) => (u.id === editingUser.id ? data : u)))

      // Refresh groups in case a new one was created
      fetchGroups()

      // Close modal
      setShowEditModal(false)
      setEditingUser(null)
      setEditNewGroupName('')
    } catch (error) {
      setEditError(error instanceof Error ? error.message : 'Failed to update user')
    } finally {
      setUpdatingUser(false)
    }
  }

  const toggleService = (service: string, isNew: boolean = true) => {
    if (isNew) {
      const services = newUser.services.includes(service)
        ? newUser.services.filter((s) => s !== service)
        : [...newUser.services, service]
      setNewUser({ ...newUser, services })
    } else if (editingUser) {
      const services = editingUser.services.includes(service)
        ? editingUser.services.filter((s) => s !== service)
        : [...editingUser.services, service]
      setEditingUser({ ...editingUser, services })
    }
  }

  const openEditModal = (user: UserData) => {
    setEditingUser({ ...user })
    setEditNewGroupName('')
    setEditError('')
    setShowEditModal(true)
  }

  const filteredUsers = users
    .filter((user) => {
      if (filter === 'all') return true
      return user.role === filter
    })
    .filter(
      (user) =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.loginId?.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const adminCount = users.filter((u) => u.role === 'ADMIN').length
  const clientCount = users.filter((u) => u.role === 'CLIENT').length
  const activeCount = users.filter((u) => u.isActive).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">Users</h1>
          <p className="text-text-muted mt-1">
            {users.length} total users - {activeCount} active
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-light"
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-light">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Add New User</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setAddError('')
                    setNewUser({ name: '', email: '', phone: '', dateOfBirth: '', role: 'CLIENT', services: [], groupId: '', newGroupName: '' })
                  }}
                  className="text-text-muted hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              {addError && (
                <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r">
                  <p className="text-sm text-red-700">{addError}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'ADMIN' | 'CLIENT' })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="CLIENT">Client</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name {newUser.role === 'CLIENT' && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required={newUser.role === 'CLIENT'}
                />
              </div>

              {newUser.role === 'CLIENT' && (
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">
                    Date of Birth / Incorporation <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={newUser.dateOfBirth}
                    onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })}
                    required
                  />
                  <p className="text-xs text-text-muted">Login ID will be auto-generated from name and date</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address {newUser.role === 'ADMIN' && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required={newUser.role === 'ADMIN'}
                />
                {newUser.role === 'CLIENT' && (
                  <p className="text-xs text-text-muted">Optional for clients</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                />
              </div>

              {newUser.role === 'CLIENT' && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r">
                  <p className="text-sm text-blue-700">
                    <strong>Default Password:</strong> Password123
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Users can change their password after first login</p>
                </div>
              )}

              {newUser.role === 'CLIENT' && (
                <>
                  <div className="space-y-2">
                    <Label>Group (Optional)</Label>
                    <p className="text-xs text-text-muted mb-2">Assign client to a group or create new one</p>
                    <select
                      value={newUser.groupId}
                      onChange={(e) => setNewUser({ ...newUser, groupId: e.target.value, newGroupName: '' })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">No Group</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2">
                      <Label htmlFor="newGroupName" className="text-xs text-text-muted">Or create new group:</Label>
                      <Input
                        id="newGroupName"
                        placeholder="Enter new group name"
                        value={newUser.newGroupName}
                        onChange={(e) => setNewUser({ ...newUser, newGroupName: e.target.value, groupId: '' })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Services Offered</Label>
                    <p className="text-xs text-text-muted mb-2">Select services being provided to this client</p>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-border-light rounded-md p-3">
                      {AVAILABLE_SERVICES.map((service) => (
                        <label
                          key={service}
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-bg-secondary p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={newUser.services.includes(service)}
                            onChange={() => toggleService(service, true)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span>{service}</span>
                        </label>
                      ))}
                    </div>
                    {newUser.services.length > 0 && (
                      <p className="text-xs text-primary">{newUser.services.length} service(s) selected</p>
                    )}
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowAddModal(false)
                    setAddError('')
                    setNewUser({ name: '', email: '', phone: '', dateOfBirth: '', role: 'CLIENT', services: [], groupId: '', newGroupName: '' })
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-light"
                  disabled={addingUser}
                >
                  {addingUser ? (
                    <>
                      <span className="animate-spin mr-2">&#9696;</span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-light">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Edit User</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingUser(null)
                    setEditError('')
                  }}
                  className="text-text-muted hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleEditUser} className="p-6 space-y-4">
              {editError && (
                <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r">
                  <p className="text-sm text-red-700">{editError}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter full name"
                  value={editingUser.name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>

              {editingUser.loginId && (
                <div className="space-y-2">
                  <Label>Login ID</Label>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-gray-100">
                    <Key className="h-4 w-4 text-text-muted" />
                    <span className="text-sm font-medium">{editingUser.loginId}</span>
                  </div>
                  <p className="text-xs text-text-muted">Login ID cannot be changed</p>
                </div>
              )}

              {editingUser.dateOfBirth && (
                <div className="space-y-2">
                  <Label>Date of Birth / Incorporation</Label>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-gray-100">
                    <Calendar className="h-4 w-4 text-text-muted" />
                    <span className="text-sm">{new Date(editingUser.dateOfBirth).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="user@example.com"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <select
                  id="edit-role"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'ADMIN' | 'CLIENT' })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="CLIENT">Client</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {editingUser.role === 'CLIENT' && (
                <>
                  <div className="space-y-2">
                    <Label>Group (Optional)</Label>
                    <p className="text-xs text-text-muted mb-2">Assign client to a group or create new one</p>
                    <select
                      value={editingUser.groupId || ''}
                      onChange={(e) => {
                        setEditingUser({ ...editingUser, groupId: e.target.value || null })
                        setEditNewGroupName('')
                      }}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">No Group</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2">
                      <Label htmlFor="editNewGroupName" className="text-xs text-text-muted">Or create new group:</Label>
                      <Input
                        id="editNewGroupName"
                        placeholder="Enter new group name"
                        value={editNewGroupName}
                        onChange={(e) => {
                          setEditNewGroupName(e.target.value)
                          if (e.target.value) {
                            setEditingUser({ ...editingUser, groupId: null })
                          }
                        }}
                        className="mt-1"
                      />
                    </div>
                    {editingUser.group && !editNewGroupName && (
                      <p className="text-xs text-primary">Current group: {editingUser.group.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Services Offered</Label>
                    <p className="text-xs text-text-muted mb-2">Select services being provided to this client</p>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-border-light rounded-md p-3">
                      {AVAILABLE_SERVICES.map((service) => (
                        <label
                          key={service}
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-bg-secondary p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={editingUser.services.includes(service)}
                            onChange={() => toggleService(service, false)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span>{service}</span>
                        </label>
                      ))}
                    </div>
                    {editingUser.services.length > 0 && (
                      <p className="text-xs text-primary">{editingUser.services.length} service(s) selected</p>
                    )}
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingUser(null)
                    setEditError('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-light"
                  disabled={updatingUser}
                >
                  {updatingUser ? (
                    <>
                      <span className="animate-spin mr-2">&#9696;</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <User className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Admins</p>
                <p className="text-2xl font-bold">{adminCount}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Clients</p>
                <p className="text-2xl font-bold">{clientCount}</p>
              </div>
              <User className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Active</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
              <Check className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="Search users..."
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
                All
              </Button>
              <Button
                variant={filter === 'ADMIN' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('ADMIN')}
              >
                Admins
              </Button>
              <Button
                variant={filter === 'CLIENT' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('CLIENT')}
              >
                Clients
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-16 w-16 mx-auto text-text-muted opacity-50" />
              <h3 className="mt-4 text-lg font-semibold text-text-primary">No users found</h3>
              <p className="text-text-muted mt-1">Users will appear here once registered</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-secondary border-b border-border-light">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-text-muted">User</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-text-muted">Contact</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-text-muted">Role</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-text-muted">Group</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-text-muted">Services</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-text-muted">Status</th>
                    <th className="text-right px-6 py-3 text-sm font-semibold text-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-bg-secondary/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">{user.name || 'No name'}</p>
                            {user.loginId && (
                              <div className="flex items-center gap-1 text-sm text-text-muted">
                                <Key className="h-3 w-3" />
                                <span>{user.loginId}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {user.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-text-muted" />
                              <span>{user.email}</span>
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-text-muted" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          {!user.email && !user.phone && (
                            <span className="text-sm text-text-muted">No contact info</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {user.role === 'ADMIN' ? (
                            <Shield className="h-3 w-3" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.role === 'CLIENT' ? (
                          user.group ? (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-text-muted" />
                              <span className="text-sm font-medium">{user.group.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-text-muted">No group</span>
                          )
                        ) : (
                          <span className="text-sm text-text-muted">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {user.role === 'CLIENT' ? (
                          user.services && user.services.length > 0 ? (
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4 text-text-muted" />
                              <span className="text-sm text-primary font-medium">
                                {user.services.length} service{user.services.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-text-muted">No services</span>
                          )
                        ) : (
                          <span className="text-sm text-text-muted">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {user.isActive ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(user)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserStatus(user.id, user.isActive)}
                          >
                            {user.isActive ? (
                              <>
                                <ShieldOff className="h-4 w-4 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Shield className="h-4 w-4 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
