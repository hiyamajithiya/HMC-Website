'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Key,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Building2
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
  role: 'ADMIN' | 'STAFF' | 'CLIENT'
  isActive: boolean
  services: string[]
  groupId: string | null
  group: ClientGroup | null
  createdAt: string
}

export default function UsersPage() {
  const { data: session } = useSession()
  const currentUserRole = session?.user?.role as 'ADMIN' | 'STAFF' | 'CLIENT' | undefined
  const isStaff = currentUserRole === 'STAFF'

  const [users, setUsers] = useState<UserData[]>([])
  const [groups, setGroups] = useState<ClientGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'ADMIN' | 'STAFF' | 'CLIENT'>('all')
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
    role: 'CLIENT' as 'ADMIN' | 'STAFF' | 'CLIENT',
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
      // Staff users can only create CLIENT users
      const userToCreate = isStaff ? { ...newUser, role: 'CLIENT' as const } : newUser

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userToCreate),
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
      setNewUser({ name: '', email: '', phone: '', dateOfBirth: '', role: 'CLIENT' as 'ADMIN' | 'STAFF' | 'CLIENT', services: [], groupId: '', newGroupName: '' })
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
          email: editingUser.email,
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
  const staffCount = users.filter((u) => u.role === 'STAFF').length
  const clientCount = users.filter((u) => u.role === 'CLIENT').length
  const activeCount = users.filter((u) => u.isActive).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-500 mt-1">Manage all user accounts and permissions</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-dark text-white"
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Add New User</h2>
                    <p className="text-sm text-slate-500">Create a new account</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setAddError('')
                    setNewUser({ name: '', email: '', phone: '', dateOfBirth: '', role: 'CLIENT' as 'ADMIN' | 'STAFF' | 'CLIENT', services: [], groupId: '', newGroupName: '' })
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              {addError && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <p className="text-sm text-red-600">{addError}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-slate-700">Role</Label>
                {isStaff ? (
                  <>
                    <div className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm flex items-center text-slate-600">
                      Client
                    </div>
                    <p className="text-xs text-slate-500">Staff can only create client users</p>
                  </>
                ) : (
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'ADMIN' | 'STAFF' | 'CLIENT' })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="CLIENT">Client</option>
                    <option value="STAFF">Staff</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                )}
                {newUser.role === 'STAFF' && !isStaff && (
                  <p className="text-xs text-amber-600">Staff can only manage users and documents</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Full Name {newUser.role === 'CLIENT' && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required={newUser.role === 'CLIENT'}
                  className="rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {newUser.role === 'CLIENT' && (
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium text-slate-700">
                    Date of Birth / Incorporation <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={newUser.dateOfBirth}
                    onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })}
                    required
                    className="rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary"
                  />
                  <p className="text-xs text-slate-500">Login ID will be auto-generated from name and date</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address {(newUser.role === 'ADMIN' || newUser.role === 'STAFF') && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required={newUser.role === 'ADMIN' || newUser.role === 'STAFF'}
                  className="rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary"
                />
                {newUser.role === 'CLIENT' && (
                  <p className="text-xs text-slate-500">Optional for clients</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {newUser.role === 'CLIENT' && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex gap-3">
                    <Key className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Default Password: Password123</p>
                      <p className="text-xs text-blue-600 mt-1">Users can change their password after first login</p>
                    </div>
                  </div>
                </div>
              )}

              {newUser.role === 'CLIENT' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Group (Optional)</Label>
                    <p className="text-xs text-slate-500 mb-2">Assign client to a group or create new one</p>
                    <select
                      value={newUser.groupId}
                      onChange={(e) => setNewUser({ ...newUser, groupId: e.target.value, newGroupName: '' })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="">No Group</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2">
                      <Label htmlFor="newGroupName" className="text-xs text-slate-500">Or create new group:</Label>
                      <Input
                        id="newGroupName"
                        placeholder="Enter new group name"
                        value={newUser.newGroupName}
                        onChange={(e) => setNewUser({ ...newUser, newGroupName: e.target.value, groupId: '' })}
                        className="mt-1 rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Services Offered</Label>
                    <p className="text-xs text-slate-500 mb-2">Select services being provided to this client</p>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3">
                      {AVAILABLE_SERVICES.map((service) => (
                        <label
                          key={service}
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={newUser.services.includes(service)}
                            onChange={() => toggleService(service, true)}
                            className="rounded border-slate-300 text-primary focus:ring-primary"
                          />
                          <span className="text-slate-700">{service}</span>
                        </label>
                      ))}
                    </div>
                    {newUser.services.length > 0 && (
                      <p className="text-xs text-primary font-medium">{newUser.services.length} service(s) selected</p>
                    )}
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl border-slate-200"
                  onClick={() => {
                    setShowAddModal(false)
                    setAddError('')
                    setNewUser({ name: '', email: '', phone: '', dateOfBirth: '', role: 'CLIENT' as 'ADMIN' | 'STAFF' | 'CLIENT', services: [], groupId: '', newGroupName: '' })
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Edit className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Edit User</h2>
                    <p className="text-sm text-slate-500">Update account details</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingUser(null)
                    setEditError('')
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleEditUser} className="p-6 space-y-4">
              {editError && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <p className="text-sm text-red-600">{editError}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm font-medium text-slate-700">Full Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter full name"
                  value={editingUser.name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {editingUser.loginId && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Login ID</Label>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-slate-200 bg-slate-50">
                    <Key className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-mono text-slate-600">{editingUser.loginId}</span>
                  </div>
                  <p className="text-xs text-slate-500">Login ID cannot be changed</p>
                </div>
              )}

              {editingUser.dateOfBirth && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Date of Birth / Incorporation</Label>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-slate-200 bg-slate-50">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{new Date(editingUser.dateOfBirth).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-sm font-medium text-slate-700">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="user@example.com"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone" className="text-sm font-medium text-slate-700">Phone Number</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role" className="text-sm font-medium text-slate-700">Role</Label>
                {isStaff ? (
                  <>
                    <div className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm flex items-center text-slate-600">
                      {editingUser.role === 'CLIENT' ? 'Client' : editingUser.role === 'STAFF' ? 'Staff' : 'Admin'}
                    </div>
                    {editingUser.role !== 'CLIENT' && (
                      <p className="text-xs text-amber-600">Staff cannot change roles of Admin/Staff users</p>
                    )}
                  </>
                ) : (
                  <select
                    id="edit-role"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'ADMIN' | 'STAFF' | 'CLIENT' })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="CLIENT">Client</option>
                    <option value="STAFF">Staff</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                )}
                {editingUser.role === 'STAFF' && !isStaff && (
                  <p className="text-xs text-amber-600">Staff can only manage users and documents</p>
                )}
              </div>

              {editingUser.role === 'CLIENT' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Group (Optional)</Label>
                    <p className="text-xs text-slate-500 mb-2">Assign client to a group or create new one</p>
                    <select
                      value={editingUser.groupId || ''}
                      onChange={(e) => {
                        setEditingUser({ ...editingUser, groupId: e.target.value || null })
                        setEditNewGroupName('')
                      }}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="">No Group</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2">
                      <Label htmlFor="editNewGroupName" className="text-xs text-slate-500">Or create new group:</Label>
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
                        className="mt-1 rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    {editingUser.group && !editNewGroupName && (
                      <p className="text-xs text-primary font-medium">Current group: {editingUser.group.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Services Offered</Label>
                    <p className="text-xs text-slate-500 mb-2">Select services being provided to this client</p>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3">
                      {AVAILABLE_SERVICES.map((service) => (
                        <label
                          key={service}
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={editingUser.services.includes(service)}
                            onChange={() => toggleService(service, false)}
                            className="rounded border-slate-300 text-primary focus:ring-primary"
                          />
                          <span className="text-slate-700">{service}</span>
                        </label>
                      ))}
                    </div>
                    {editingUser.services.length > 0 && (
                      <p className="text-xs text-primary font-medium">{editingUser.services.length} service(s) selected</p>
                    )}
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl border-slate-200"
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
                  className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl"
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                <p className="text-sm text-slate-500">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{adminCount}</p>
                <p className="text-sm text-slate-500">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{staffCount}</p>
                <p className="text-sm text-slate-500">Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{clientCount}</p>
                <p className="text-sm text-slate-500">Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
                <p className="text-sm text-slate-500">Active</p>
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
                placeholder="Search by name, email, or login ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('ADMIN')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === 'ADMIN' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Admins
                </button>
                <button
                  onClick={() => setFilter('STAFF')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === 'STAFF' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Staff
                </button>
                <button
                  onClick={() => setFilter('CLIENT')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === 'CLIENT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Clients
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">User Accounts</CardTitle>
              <CardDescription>{filteredUsers.length} users found</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary/20 rounded-full border-t-primary animate-spin mx-auto"></div>
                <p className="mt-4 text-slate-500">Loading users...</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <UserX className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No users found</h3>
              <p className="text-slate-500 mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-y border-slate-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Group</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Services</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            user.role === 'ADMIN' ? 'bg-purple-100' : user.role === 'STAFF' ? 'bg-amber-100' : 'bg-blue-100'
                          }`}>
                            <span className={`font-bold text-sm ${
                              user.role === 'ADMIN' ? 'text-purple-600' : user.role === 'STAFF' ? 'text-amber-600' : 'text-blue-600'
                            }`}>
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{user.name || 'No name'}</p>
                            {user.loginId && (
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Key className="h-3 w-3" />
                                <span className="font-mono">{user.loginId}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {user.email && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail className="h-3.5 w-3.5 text-slate-400" />
                              <span className="truncate max-w-[200px]">{user.email}</span>
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          {!user.email && !user.phone && (
                            <span className="text-sm text-slate-400">No contact info</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : user.role === 'STAFF'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          <Shield className="h-3 w-3" />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.role === 'CLIENT' ? (
                          user.group ? (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-slate-400" />
                              <span className="text-sm font-medium text-slate-700">{user.group.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">No group</span>
                          )
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {user.role === 'CLIENT' ? (
                          user.services && user.services.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-slate-400" />
                              <span className="text-sm font-medium text-primary">
                                {user.services.length} service{user.services.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">No services</span>
                          )
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            user.isActive
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
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
                            className="rounded-lg border-slate-200 hover:bg-slate-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserStatus(user.id, user.isActive)}
                            className={`rounded-lg ${
                              user.isActive
                                ? 'border-red-200 text-red-600 hover:bg-red-50'
                                : 'border-green-200 text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {user.isActive ? (
                              <ShieldOff className="h-4 w-4" />
                            ) : (
                              <Shield className="h-4 w-4" />
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
