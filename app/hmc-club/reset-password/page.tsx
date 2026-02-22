'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { Shield, ArrowLeft, Lock, Loader2, CheckCircle, Eye, EyeOff, XCircle } from 'lucide-react'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setIsVerifying(false)
        return
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`)
        const data = await response.json()
        setIsValidToken(data.valid)
      } catch (err) {
        setIsValidToken(false)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-white" />
        <p className="text-white/80 mt-4">Verifying reset link...</p>
      </div>
    )
  }

  if (!token || !isValidToken) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <XCircle className="h-8 w-8 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Invalid or Expired Link</h3>
        <p className="text-white/80 text-sm mb-6">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link href="/hmc-club/forgot-password">
          <Button className="bg-secondary hover:bg-secondary-dark text-white">
            Request New Link
          </Button>
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Password Reset Successful</h3>
        <p className="text-white/80 text-sm mb-6">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Link href="/hmc-club/login">
          <Button className="bg-secondary hover:bg-secondary-dark text-white">
            Sign In
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="bg-red-500/20 border-red-500/50">
          <p className="text-sm text-white font-medium">{error}</p>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="password" style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.875rem' }}>
          New Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#ffffff' }} />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password (min 6 characters)"
            className="pl-10 pr-10"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#ffffff'
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" style={{ color: '#ffffff' }} />
            ) : (
              <Eye className="h-4 w-4" style={{ color: '#ffffff' }} />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.875rem' }}>
          Confirm New Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#ffffff' }} />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            className="pl-10 pr-10"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#ffffff'
            }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" style={{ color: '#ffffff' }} />
            ) : (
              <Eye className="h-4 w-4" style={{ color: '#ffffff' }} />
            )}
          </button>
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
            Resetting...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Reset Password
          </>
        )}
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
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
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Himanshu Majithiya & Co.
          </p>
        </div>

        {/* Reset Password Card */}
        <Card className="border-border-light shadow-xl" style={{ backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold" style={{ color: '#ffffff' }}>
              Create new password
            </CardTitle>
            <CardDescription className="text-base" style={{ color: '#ffffff', fontWeight: 500, opacity: 0.9 }}>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-white" />
                <p className="text-white/80 mt-4">Loading...</p>
              </div>
            }>
              <ResetPasswordForm />
            </Suspense>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="bg-white/10 border border-white/20 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-xs text-white font-medium text-center">
            Your new password should be at least 6 characters long and different from your previous password.
          </p>
        </div>
      </div>
    </div>
  )
}
