'use client'

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
  FolderOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

// All sidebar items with role-based visibility
const allSidebarItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['ADMIN'] },
  { name: 'Blog Posts', href: '/admin/blog', icon: FileText, roles: ['ADMIN'] },
  { name: 'Tools', href: '/admin/tools', icon: Wrench, roles: ['ADMIN'] },
  { name: 'Documents', href: '/admin/documents', icon: FolderOpen, roles: ['ADMIN', 'STAFF'] },
  { name: 'Contacts', href: '/admin/contacts', icon: Mail, roles: ['ADMIN'] },
  { name: 'Appointments', href: '/admin/appointments', icon: Calendar, roles: ['ADMIN'] },
  { name: 'Users', href: '/admin/users', icon: Users, roles: ['ADMIN', 'STAFF'] },
  { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['ADMIN'] },
]

export function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    redirect('/client-portal/login?callbackUrl=/admin')
  }

  // Check if user has admin or staff role
  const userRole = session?.user?.role
  const isAdminOrStaff = userRole === 'ADMIN' || userRole === 'STAFF'

  // Filter sidebar items based on user role
  const sidebarItems = allSidebarItems.filter(item =>
    userRole && item.roles.includes(userRole)
  )

  if (!isAdminOrStaff) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚫</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Access Denied</h1>
          <p className="text-text-muted mb-6">
            You do not have permission to access the admin panel.
          </p>
          <Link href="/">
            <Button>Return to Homepage</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-primary text-white">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href={userRole === 'STAFF' ? '/admin/documents' : '/admin'} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg">HM</span>
            </div>
            <div>
              <h1 className="font-heading font-bold">{userRole === 'STAFF' ? 'Staff Panel' : 'Admin Panel'}</h1>
              <p className="text-xs text-white/60">HMC Website</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href ||
                           (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>View Website</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-border-light px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Welcome back,</p>
              <p className="font-semibold text-text-primary">{session?.user?.name || (userRole === 'STAFF' ? 'Staff' : 'Admin')}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                userRole === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {userRole}
              </span>
              <span className="text-sm text-text-muted">{session?.user?.email}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
