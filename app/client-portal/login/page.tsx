import { Metadata } from 'next'
import { Suspense } from 'react'
import LoginForm from '@/components/client-portal/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Client Portal Login | Himanshu Majithiya & Co.',
  description: 'Access your secure client portal to view documents, track services, and manage your account.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-navy py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-secondary p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-heading font-bold text-white">
            Client Portal
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Himanshu Majithiya & Co.
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border-light shadow-xl" style={{ backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold" style={{ color: '#ffffff' }}>
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-base" style={{ color: '#ffffff', fontWeight: 500, opacity: 0.9 }}>
              Access your documents, appointments, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center text-sm text-white">
          <p>
            Need help accessing your account?{' '}
            <a
              href="/contact"
              className="font-semibold text-secondary-light hover:text-secondary underline"
            >
              Contact us
            </a>
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-white/10 border border-white/20 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-xs text-white font-medium text-center">
            Your connection is secure and encrypted. We never share your personal information.
          </p>
        </div>
      </div>
    </div>
  )
}
