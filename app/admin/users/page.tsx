'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  UserPlus,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldOff,
  MoreVertical,
  Check,
  X
} from 'lucide-react'

interface UserData {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: 'ADMIN' | 'CLIENT'
  isActive: boolean
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'ADMIN' | 'CLIENT'>('all')

  useEffect(() => {
    fetchUsers()
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

  const filteredUsers = users
    .filter((user) => {
      if (filter === 'all') return true
      return user.role === filter
    })
    .filter(
      (user) =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
            {users.length} total users • {activeCount} active
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-light">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

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
                    <th className="text-left px-6 py-3 text-sm font-semibold text-text-muted">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-text-muted">Joined</th>
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
                            <p className="text-sm text-text-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-text-muted" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-text-muted" />
                              <span>{user.phone}</span>
                            </div>
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-text-muted">
                          <Calendar className="h-4 w-4" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
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
