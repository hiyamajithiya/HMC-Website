'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { Loader2, User, Lock, Building2, ArrowLeft, Key } from 'lucide-react'

const loginSchema = z.object({
  identifier: z.string().min(1, 'Login ID or Email is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface UserAccount {
  id: string
  name: string | null
  loginId: string | null
}

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/client-portal/dashboard'

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Multi-account selection state
  const [showAccountSelector, setShowAccountSelector] = useState(false)
  const [availableAccounts, setAvailableAccounts] = useState<UserAccount[]>([])
  const [savedCredentials, setSavedCredentials] = useState<{ identifier: string; password: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')

    try {
      // First validate credentials via our custom API for proper error messages
      const validateResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: data.identifier,
          password: data.password,
        }),
      })

      const validateResult = await validateResponse.json()

      if (!validateResult.success) {
        // Check if this is a multi-account scenario
        if (validateResult.multiAccount) {
          setAvailableAccounts(validateResult.accounts as UserAccount[])
          setSavedCredentials({ identifier: data.identifier, password: data.password })
          setShowAccountSelector(true)
          return
        }
        // Show the actual error message
        setError(validateResult.error || 'Login failed')
        return
      }

      // Credentials are valid, now sign in with NextAuth
      const result = await signIn('credentials', {
        identifier: data.identifier,
        password: data.password,
        selectedUserId: validateResult.userId,
        redirect: false,
      })

      if (result?.error) {
        setError('Login failed. Please try again.')
      } else if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccountSelect = async (userId: string) => {
    if (!savedCredentials) return

    setIsLoading(true)
    setError('')

    try {
      // First validate the selected account via our custom API
      const validateResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: savedCredentials.identifier,
          password: savedCredentials.password,
          selectedUserId: userId,
        }),
      })

      const validateResult = await validateResponse.json()

      if (!validateResult.success) {
        setError(validateResult.error || 'Login failed')
        return
      }

      // Credentials are valid, now sign in with NextAuth
      const result = await signIn('credentials', {
        identifier: savedCredentials.identifier,
        password: savedCredentials.password,
        selectedUserId: userId,
        redirect: false,
      })

      if (result?.error) {
        setError('Login failed. Please try again.')
      } else if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setShowAccountSelector(false)
    setAvailableAccounts([])
    setSavedCredentials(null)
    setError('')
  }

  // Account selection screen
  if (showAccountSelector) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold" style={{ color: '#ffffff' }}>
            Select Account
          </h3>
          <p className="text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Multiple accounts found with this email. Please select one to continue.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-red-500/20 border-red-500/50">
            <p className="text-sm text-white font-medium">{error}</p>
          </Alert>
        )}

        <div className="space-y-3">
          {availableAccounts.map((account) => (
            <button
              key={account.id}
              onClick={() => handleAccountSelect(account.id)}
              disabled={isLoading}
              className="w-full p-4 rounded-lg border transition-all hover:bg-white/10 disabled:opacity-50"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5" style={{ color: '#ffffff' }} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium" style={{ color: '#ffffff' }}>
                    {account.name || 'Unnamed Account'}
                  </p>
                  {account.loginId && (
                    <div className="flex items-center gap-1 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      <Key className="h-3 w-3" />
                      <span>{account.loginId}</span>
                    </div>
                  )}
                </div>
                {isLoading && (
                  <Loader2 className="h-5 w-5 animate-spin" style={{ color: '#ffffff' }} />
                )}
              </div>
            </button>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleBackToLogin}
          disabled={isLoading}
          style={{
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            backgroundColor: 'transparent',
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Button>
      </div>
    )
  }

  // Regular login form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="bg-red-500/20 border-red-500/50">
          <p className="text-sm text-white font-medium">{error}</p>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="identifier" style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.875rem' }}>
          Login ID or Email
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#ffffff' }} />
          <Input
            id="identifier"
            type="text"
            placeholder="Enter your login ID or email"
            className="pl-10"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#ffffff'
            }}
            {...register('identifier')}
            disabled={isLoading}
          />
        </div>
        {errors.identifier && (
          <p className="text-sm text-red-600 font-medium">{errors.identifier.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.875rem' }}>
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#ffffff' }} />
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="pl-10"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#ffffff'
            }}
            {...register('password')}
            disabled={isLoading}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded cursor-pointer"
            style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm cursor-pointer" style={{ color: '#ffffff', fontWeight: 500 }}>
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="/contact" className="underline-offset-2 hover:underline" style={{ color: '#ffffff', fontWeight: 600 }}>
            Forgot password?
          </a>
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
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  )
}
