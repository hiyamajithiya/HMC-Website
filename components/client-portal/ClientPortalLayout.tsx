'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  FileText,
  Calendar,
  User,
  Bell,
  LogOut,
  Home,
  Menu,
  X,
  Shield,
  ChevronRight,
  Settings
} from 'lucide-react'
import { useState } from 'react'

interface ClientPortalLayoutProps {
  children: React.ReactNode
  userName?: string | null
  userEmail?: string | null
  isAdmin?: boolean
}

const navItems = [
  { href: '/client-portal/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & stats' },
  { href: '/client-portal/documents', label: 'Documents', icon: FileText, description: 'View & upload files' },
  { href: '/client-portal/appointments', label: 'Appointments', icon: Calendar, description: 'Schedule meetings' },
  { href: '/client-portal/profile', label: 'Profile', icon: User, description: 'Account settings' },
]

export default function ClientPortalLayout({
  children,
  userName,
  userEmail,
  isAdmin = false
}: ClientPortalLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Get first letter for avatar
  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : 'U'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary to-primary-dark text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Logo */}
              <Link href="/client-portal/dashboard" className="flex items-center gap-3 group">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl group-hover:bg-white/20 transition-colors">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-heading font-bold tracking-tight">Client Portal</h1>
                  <p className="text-xs text-white/70">Himanshu Majithiya & Co.</p>
                </div>
              </Link>
            </div>

            {/* Right side - User info & actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Admin Panel Link */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary/90 hover:bg-secondary text-white rounded-lg text-sm font-medium transition-all hover:shadow-md"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Main Website Link */}
              <Link
                href="/"
                className="hidden md:flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Website</span>
              </Link>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full"></span>
              </Button>

              {/* User Avatar & Dropdown */}
              <div className="flex items-center gap-3 pl-3 border-l border-white/20">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">{userName || 'User'}</p>
                  <p className="text-xs text-white/70 truncate max-w-[120px]">{userEmail}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center font-bold text-white shadow-md">
                  {avatarLetter}
                </div>
              </div>

              {/* Sign Out */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => signOut({ callbackUrl: '/client-portal/login' })}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Navigation */}
      <nav className="bg-white border-b border-slate-200 hidden md:block sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-all relative group ${
                    isActive
                      ? 'text-primary'
                      : 'text-slate-600 hover:text-primary'
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${isActive ? 'text-secondary' : 'text-slate-400 group-hover:text-secondary'}`} />
                  <span>{item.label}</span>
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-secondary to-primary"></span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-in menu */}
          <nav className="fixed top-16 left-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
            <div className="p-4 space-y-2">
              {/* User Info Card */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center font-bold text-white text-lg">
                    {avatarLetter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{userName || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <div className="flex-1">
                      <span className="block">{item.label}</span>
                      <span className={`text-xs ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                        {item.description}
                      </span>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${isActive ? 'text-white/60' : 'text-slate-300'}`} />
                  </Link>
                )
              })}

              {/* Divider */}
              <hr className="my-4 border-slate-200" />

              {/* Additional Links */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                <Home className="h-5 w-5 text-slate-400" />
                <span>Main Website</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium bg-secondary/10 text-secondary hover:bg-secondary/20"
                >
                  <Settings className="h-5 w-5" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* Sign Out */}
              <button
                onClick={() => signOut({ callbackUrl: '/client-portal/login' })}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 mt-4"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Shield className="h-4 w-4 text-secondary" />
              <span>&copy; {new Date().getFullYear()} Himanshu Majithiya & Co.</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <Link href="/privacy-policy" className="text-slate-500 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-use" className="text-slate-500 hover:text-primary transition-colors">
                Terms of Use
              </Link>
              <Link href="/contact" className="text-slate-500 hover:text-primary transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
