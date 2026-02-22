'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { Shield, ArrowLeft, Mail, Loader2, CheckCircle, User } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Failed to send reset email')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-navy py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Back to Login Link */}
      <Link
        href="/hmc-club/login"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Login</span>
      </Link>

      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-secondary p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-heading font-bold text-white">
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Himanshu Majithiya & Co.
          </p>
        </div>

        {/* Forgot Password Card */}
        <Card className="border-border-light shadow-xl" style={{ backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold" style={{ color: '#ffffff' }}>
              Reset your password
            </CardTitle>
            <CardDescription className="text-base" style={{ color: '#ffffff', fontWeight: 500, opacity: 0.9 }}>
              Enter your email or login ID and we&apos;ll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Check your email</h3>
                <p className="text-white/80 text-sm mb-6">
                  If an account exists with this email/login ID, you will receive a password reset link shortly.
                </p>
                <Link href="/hmc-club/login">
                  <Button className="bg-secondary hover:bg-secondary-dark text-white">
                    Return to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="bg-red-500/20 border-red-500/50">
                    <p className="text-sm text-white font-medium">{error}</p>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="identifier" style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.875rem' }}>
                    Email or Login ID
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#ffffff' }} />
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="Enter your email or login ID"
                      className="pl-10"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: '#ffffff'
                      }}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary-dark text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Reset Link
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center text-sm text-white">
          <p>
            Remember your password?{' '}
            <Link
              href="/hmc-club/login"
              className="font-semibold text-secondary-light hover:text-secondary underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Contact Notice */}
        <div className="bg-white/10 border border-white/20 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-xs text-white font-medium text-center">
            If you don&apos;t receive an email, please contact us at{' '}
            <a href="mailto:info@himanshumajithiya.com" className="underline">info@himanshumajithiya.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
