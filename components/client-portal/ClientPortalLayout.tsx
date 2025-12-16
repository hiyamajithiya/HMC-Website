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
  Shield
} from 'lucide-react'
import { useState } from 'react'

interface ClientPortalLayoutProps {
  children: React.ReactNode
  userName?: string | null
  userEmail?: string | null
  isAdmin?: boolean
}

const navItems = [
  { href: '/client-portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/client-portal/documents', label: 'Documents', icon: FileText },
  { href: '/client-portal/appointments', label: 'Appointments', icon: Calendar },
  { href: '/client-portal/profile', label: 'Profile', icon: User },
]

export default function ClientPortalLayout({
  children,
  userName,
  userEmail,
  isAdmin = false
}: ClientPortalLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <header className="bg-primary text-white border-b border-primary-dark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-white/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <div>
                <Link href="/client-portal/dashboard" className="text-2xl font-heading font-bold hover:opacity-90">
                  Client Portal
                </Link>
                <p className="text-sm text-white/80 hidden sm:block">
                  Welcome back, {userName || 'User'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </Link>
              )}
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="hidden md:inline">Main Website</span>
              </Link>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => signOut({ callbackUrl: '/client-portal/login' })}
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Navigation */}
      <nav className="bg-white border-b border-border-light hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-secondary text-secondary'
                      : 'border-transparent text-text-muted hover:text-primary hover:border-border-light'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="bg-white border-b border-border-light md:hidden">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-muted hover:bg-gray-100 hover:text-primary'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-text-muted hover:bg-gray-100 hover:text-primary"
            >
              <Home className="h-5 w-5" />
              Main Website
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium bg-secondary/10 text-secondary hover:bg-secondary/20"
              >
                <Shield className="h-5 w-5" />
                Admin Panel
              </Link>
            )}
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border-light py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-text-muted">
            <p>&copy; {new Date().getFullYear()} Himanshu Majithiya & Co. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
              <Link href="/terms-of-use" className="hover:text-primary">Terms of Use</Link>
              <Link href="/contact" className="hover:text-primary">Contact Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
