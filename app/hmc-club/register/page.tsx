import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Info } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Register | HMC Club | Himanshu Majithiya & Co.',
  description: 'Request access to HMC Club for Himanshu Majithiya & Co.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RegisterPage() {
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
            HMC Club
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Himanshu Majithiya & Co.
          </p>
        </div>

        {/* Registration Info Card */}
        <Card className="border-border-light shadow-xl" style={{ backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold" style={{ color: '#ffffff' }}>
              Request Portal Access
            </CardTitle>
            <CardDescription className="text-base" style={{ color: '#ffffff', fontWeight: 500, opacity: 0.9 }}>
              HMC Club access is available for existing clients only
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Info Box */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-white/90">
                  <p className="font-medium mb-2">How to get access:</p>
                  <ol className="list-decimal list-inside space-y-1 text-white/80">
                    <li>Contact our office via phone or email</li>
                    <li>Provide your client details for verification</li>
                    <li>Receive your login credentials via email</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 text-white/90">
              <p className="text-sm font-medium">Contact us to request access:</p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-white/60">Phone:</span>{' '}
                  <a href="tel:+919879503465" className="text-secondary-light hover:text-secondary">
                    +91 98795 03465
                  </a>
                </p>
                <p>
                  <span className="text-white/60">Email:</span>{' '}
                  <a href="mailto:info@himanshumajithiya.com" className="text-secondary-light hover:text-secondary">
                    info@himanshumajithiya.com
                  </a>
                </p>
              </div>
            </div>

            {/* Back to Login */}
            <div className="pt-4 border-t border-white/20">
              <Link
                href="/hmc-club/login"
                className="block w-full text-center py-2 px-4 rounded-md bg-secondary hover:bg-secondary-dark text-white font-medium transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Already have account link */}
        <div className="text-center text-sm text-white">
          <p>
            Already have an account?{' '}
            <Link
              href="/hmc-club/login"
              className="font-semibold text-secondary-light hover:text-secondary underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
