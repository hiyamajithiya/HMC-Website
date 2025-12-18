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
  TrendingUp,
  Plus,
  ArrowRight,
  FolderOpen,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Sun,
  Moon,
  Sunrise,
  Sunset
} from 'lucide-react'

interface DashboardStats {
  totalBlogPosts: number
  publishedPosts: number
  totalTools: number
  activeTools: number
  unreadContacts: number
  pendingAppointments: number
  totalUsers: number
  totalDocuments?: number
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
    totalDocuments: 0,
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

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { text: 'Good Morning', icon: Sunrise }
    if (hour < 17) return { text: 'Good Afternoon', icon: Sun }
    if (hour < 20) return { text: 'Good Evening', icon: Sunset }
    return { text: 'Good Night', icon: Moon }
  }

  const greeting = getGreeting()
  const GreetingIcon = greeting.icon

  const statCards = [
    {
      title: 'Blog Posts',
      value: stats.totalBlogPosts,
      subValue: `${stats.publishedPosts} published`,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      href: '/admin/blog',
      trend: '+12%',
    },
    {
      title: 'Tools',
      value: stats.totalTools,
      subValue: `${stats.activeTools} active`,
      icon: Wrench,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      href: '/admin/tools',
      trend: '+5%',
    },
    {
      title: 'Contacts',
      value: stats.unreadContacts,
      subValue: 'Unread messages',
      icon: Mail,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      href: '/admin/contacts',
      trend: 'New',
      highlight: stats.unreadContacts > 0,
    },
    {
      title: 'Appointments',
      value: stats.pendingAppointments,
      subValue: 'Pending',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      href: '/admin/appointments',
      trend: 'Today',
      highlight: stats.pendingAppointments > 0,
    },
  ]

  const quickActions = [
    { title: 'New Blog Post', description: 'Write an article', href: '/admin/blog/new', icon: FileText, color: 'from-blue-500 to-blue-600' },
    { title: 'Add Tool', description: 'Create a new tool', href: '/admin/tools/new', icon: Wrench, color: 'from-emerald-500 to-emerald-600' },
    { title: 'Upload Document', description: 'Add client files', href: '/admin/documents', icon: FolderOpen, color: 'from-amber-500 to-amber-600' },
    { title: 'Manage Users', description: 'View all accounts', href: '/admin/users', icon: Users, color: 'from-purple-500 to-purple-600' },
  ]

  const recentActivities = [
    { type: 'user', text: 'New user registered', time: '2 hours ago', icon: Users },
    { type: 'contact', text: 'New contact form submission', time: '5 hours ago', icon: Mail },
    { type: 'document', text: 'Document uploaded', time: '1 day ago', icon: FolderOpen },
    { type: 'appointment', text: 'Appointment confirmed', time: '2 days ago', icon: Calendar },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary via-primary to-primary-dark rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <GreetingIcon className="h-5 w-5" />
            </div>
            <span className="text-white/80 text-sm font-medium">{greeting.text}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'Admin'}!
          </h1>
          <p className="text-white/70 max-w-xl">
            Here&apos;s what&apos;s happening with your website today. You have{' '}
            <span className="text-secondary font-semibold">{stats.unreadContacts} unread messages</span> and{' '}
            <span className="text-secondary font-semibold">{stats.pendingAppointments} pending appointments</span>.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/admin/contacts">
              <Button className="bg-white text-primary hover:bg-white/90">
                <Mail className="h-4 w-4 mr-2" />
                View Messages
              </Button>
            </Link>
            <Link href="/admin/blog/new">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className={`border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer group ${stat.highlight ? 'ring-2 ring-orange-200' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                        {stat.highlight && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-3xl font-bold text-slate-900 mt-1">
                        {loading ? (
                          <span className="inline-block w-12 h-8 bg-slate-200 rounded animate-pulse"></span>
                        ) : (
                          stat.value
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-500">{stat.subValue}</span>
                        {stat.trend && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            stat.trend === 'New' ? 'bg-orange-100 text-orange-600' :
                            stat.trend === 'Today' ? 'bg-purple-100 text-purple-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {stat.trend}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks you might want to do</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.title} href={action.href}>
                  <div className="group p-4 rounded-xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-slate-500">{action.description}</p>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Go <ArrowUpRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <CardDescription>Latest updates on your website</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-500">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{activity.text}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Overview</CardTitle>
                <CardDescription>Website summary</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-slate-400" />
                  <span className="text-sm text-slate-600">Total Users</span>
                </div>
                <span className="font-bold text-slate-900">
                  {loading ? '...' : stats.totalUsers}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-5 w-5 text-slate-400" />
                  <span className="text-sm text-slate-600">Documents</span>
                </div>
                <span className="font-bold text-slate-900">
                  {loading ? '...' : (stats.totalDocuments || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-slate-600">Active Tools</span>
                </div>
                <span className="font-bold text-slate-900">
                  {loading ? '...' : stats.activeTools}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span className="text-sm text-slate-600">Pending Items</span>
                </div>
                <span className="font-bold text-slate-900">
                  {loading ? '...' : stats.unreadContacts + stats.pendingAppointments}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-50 to-white overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Need Help Getting Started?</h3>
                <p className="text-slate-500 mt-1 max-w-md">
                  Learn how to manage your website content effectively with our comprehensive documentation.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-primary hover:bg-primary-dark text-white">
                View Documentation
              </Button>
              <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
