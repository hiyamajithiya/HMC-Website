'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Wrench,
  Mail,
  Calendar,
  Users,
  Eye,
  TrendingUp,
  Plus,
  ArrowRight
} from 'lucide-react'

interface DashboardStats {
  totalBlogPosts: number
  publishedPosts: number
  totalTools: number
  activeTools: number
  unreadContacts: number
  pendingAppointments: number
  totalUsers: number
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const router = useRouter()

  // Redirect STAFF users to documents page (they don't have access to dashboard)
  useEffect(() => {
    if (session?.user?.role === 'STAFF') {
      router.replace('/admin/documents')
    }
  }, [session, router])
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogPosts: 0,
    publishedPosts: 0,
    totalTools: 0,
    activeTools: 0,
    unreadContacts: 0,
    pendingAppointments: 0,
    totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch stats from API
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Blog Posts',
      value: stats.totalBlogPosts,
      subValue: `${stats.publishedPosts} published`,
      icon: FileText,
      color: 'bg-blue-500',
      href: '/admin/blog',
    },
    {
      title: 'Tools',
      value: stats.totalTools,
      subValue: `${stats.activeTools} active`,
      icon: Wrench,
      color: 'bg-green-500',
      href: '/admin/tools',
    },
    {
      title: 'Unread Contacts',
      value: stats.unreadContacts,
      subValue: 'Awaiting response',
      icon: Mail,
      color: 'bg-orange-500',
      href: '/admin/contacts',
    },
    {
      title: 'Appointments',
      value: stats.pendingAppointments,
      subValue: 'Pending confirmation',
      icon: Calendar,
      color: 'bg-purple-500',
      href: '/admin/appointments',
    },
  ]

  const quickActions = [
    { title: 'New Blog Post', href: '/admin/blog/new', icon: FileText },
    { title: 'Add Tool', href: '/admin/tools/new', icon: Wrench },
    { title: 'View Contacts', href: '/admin/contacts', icon: Mail },
    { title: 'Appointments', href: '/admin/appointments', icon: Calendar },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-muted mt-1">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-text-muted">{stat.title}</p>
                      <p className="text-3xl font-bold text-text-primary mt-1">
                        {loading ? '...' : stat.value}
                      </p>
                      <p className="text-sm text-text-muted mt-1">{stat.subValue}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.title} href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary hover:text-white"
                  >
                    <Icon className="h-6 w-6" />
                    <span>{action.title}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blog Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Blog Posts</CardTitle>
              <CardDescription>Latest articles on the website</CardDescription>
            </div>
            <Link href="/admin/blog">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-text-muted">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No blog posts yet</p>
              <Link href="/admin/blog/new">
                <Button size="sm" className="mt-4 bg-primary text-white hover:bg-primary-light">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Contacts</CardTitle>
              <CardDescription>Latest form submissions</CardDescription>
            </div>
            <Link href="/admin/contacts">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-text-muted">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No contact submissions yet</p>
              <p className="text-sm mt-2">Submissions will appear here when visitors contact you</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="bg-primary text-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Need Help?</h3>
              <p className="text-white/80 mb-4">
                Learn how to manage your website content effectively.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" size="sm" className="bg-secondary hover:bg-secondary-dark text-white">
                  View Documentation
                </Button>
                <Button variant="outline" size="sm" className="border-white text-white bg-transparent hover:bg-white/20">
                  Contact Support
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-12 w-12" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
