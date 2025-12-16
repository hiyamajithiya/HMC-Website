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
import { Loader2, User, Lock } from 'lucide-react'

const loginSchema = z.object({
  identifier: z.string().min(1, 'Login ID or Email is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/client-portal/dashboard'
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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
      const result = await signIn('credentials', {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <p className="text-sm">{error}</p>
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
