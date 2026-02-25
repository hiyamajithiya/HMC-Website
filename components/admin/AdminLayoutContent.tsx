'use client'

import { Suspense, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Wrench,
  Mail,
  Calendar,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Home,
  FolderOpen,
  Menu,
  X,
  Bell,
  Search,
  Shield,
  ChevronDown,
  Download,
  UserCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

// All sidebar items with role-based visibility
const allSidebarItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['ADMIN'], description: 'Overview & stats' },
  { name: 'Blog Posts', href: '/admin/blog', icon: FileText, roles: ['ADMIN'], description: 'Manage articles' },
  { name: 'Tools', href: '/admin/tools', icon: Wrench, roles: ['ADMIN'], description: 'Automation tools' },
  { name: 'Tool Leads', href: '/admin/leads', icon: UserCheck, roles: ['ADMIN'], description: 'Download requests' },
  { name: 'Documents', href: '/admin/documents', icon: FolderOpen, roles: ['ADMIN', 'STAFF'], description: 'Client files' },
  { name: 'Contacts', href: '/admin/contacts', icon: Mail, roles: ['ADMIN'], description: 'Form submissions' },
  { name: 'Appointments', href: '/admin/appointments', icon: Calendar, roles: ['ADMIN'], description: 'Bookings' },
  { name: 'Users', href: '/admin/users', icon: Users, roles: ['ADMIN', 'STAFF'], description: 'Manage accounts' },
  { name: 'Articles', href: '/admin/articles', icon: Download, roles: ['ADMIN'], description: 'Manage articles' },
  { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['ADMIN'], description: 'Site config' },
]

export function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    redirect('/hmc-club/login?callbackUrl=/admin')
  }

  // Check if user has admin or staff role
  const userRole = session?.user?.role
  const isAdminOrStaff = userRole === 'ADMIN' || userRole === 'STAFF'
  const isAdmin = userRole === 'ADMIN'

  // Filter sidebar items based on user role
  const sidebarItems = allSidebarItems.filter(item =>
    userRole && item.roles.includes(userRole)
  )

  if (!isAdminOrStaff) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-6">
            You do not have permission to access the admin panel.
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary-dark text-white">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Get first letter for avatar
  const avatarLetter = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-primary via-primary to-primary-dark transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href={userRole === 'STAFF' ? '/admin/documents' : '/admin'} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center shadow-lg">
              <span className="font-bold text-lg text-white">HM</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-white text-lg">
                {userRole === 'STAFF' ? 'Staff Panel' : 'Admin Panel'}
              </h1>
              <p className="text-xs text-white/60">Himanshu Majithiya & Co.</p>
            </div>
          </Link>
          {/* Mobile close button */}
          <button
            className="absolute top-6 right-4 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-100px)]">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href ||
                           (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all no-underline border-none group ${
                  isActive
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-medium">{item.name}</span>
                  <span className={`text-xs ${isActive ? 'text-white/70' : 'text-white/50'}`}>{item.description}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            )
          })}

          {/* Divider */}
          <div className="my-3 border-t border-white/10"></div>

          {/* View Website */}
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all no-underline border-none group"
          >
            <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10">
              <Home className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block font-medium">View Website</span>
              <span className="text-xs text-white/50">Open public site</span>
            </div>
          </Link>

          {/* Sign Out */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all border-none group"
          >
            <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-red-500/20">
              <LogOut className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <span className="block font-medium">Sign Out</span>
              <span className="text-xs text-white/50">End your session</span>
            </div>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Mobile menu & Search */}
              <div className="flex items-center gap-4">
                <button
                  className="p-2 rounded-xl hover:bg-slate-100 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6 text-slate-600" />
                </button>

                {/* Welcome Text - Desktop */}
                <div className="hidden sm:block">
                  <p className="text-sm text-slate-500">Welcome back,</p>
                  <p className="font-semibold text-slate-900">{session?.user?.name || (userRole === 'STAFF' ? 'Staff' : 'Admin')}</p>
                </div>
              </div>

              {/* Right side - Actions & Profile */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Search Button */}
                <button className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
                  <Search className="h-5 w-5" />
                </button>

                {/* Notifications */}
                <button className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Divider */}
                <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                {/* Role Badge */}
                <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  userRole === 'ADMIN'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  <Shield className="h-3.5 w-3.5" />
                  {userRole}
                </span>

                {/* User Avatar */}
                <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-slate-900">{session?.user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{session?.user?.email}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center font-bold text-white shadow-md">
                    {avatarLetter}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<PageLoadingSkeleton />}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  )
}

// Fast loading skeleton for page transitions
function PageLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 bg-slate-200 rounded-lg w-48"></div>
          <div className="h-4 bg-slate-100 rounded w-64"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-32"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-20"></div>
                <div className="h-8 bg-slate-200 rounded w-16"></div>
                <div className="h-3 bg-slate-100 rounded w-24"></div>
              </div>
              <div className="h-12 w-12 bg-slate-100 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-100 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-48"></div>
                <div className="h-3 bg-slate-100 rounded w-32"></div>
              </div>
              <div className="h-8 w-20 bg-slate-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
