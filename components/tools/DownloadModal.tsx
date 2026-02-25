'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Download, Mail, Loader2, CheckCircle, UserCheck } from 'lucide-react'

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  toolId?: string
  toolName?: string
  /** For article downloads (from /resources/articles) */
  mode?: 'tool' | 'article'
  articleId?: string
  articleName?: string
}

type Step = 'form' | 'otp' | 'success'

interface ReturningUser {
  name: string
  phone: string | null
  company: string | null
}

export function DownloadModal({ isOpen, onClose, toolId, toolName, mode = 'tool', articleId, articleName }: DownloadModalProps) {
  const itemId = mode === 'article' ? articleId! : toolId!
  const itemName = mode === 'article' ? articleName! : toolName!
  const apiPrefix = mode === 'article' ? '/api/articles' : '/api/tools'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Lock body scroll when modal is open + close on Escape
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose()
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [error, setError] = useState('')
  const [leadId, setLeadId] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')
  const [returningUser, setReturningUser] = useState<ReturningUser | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  })

  const [otp, setOtp] = useState('')

  // Check if email is from a returning user
  const checkEmail = async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setReturningUser(null)
      return
    }

    setCheckingEmail(true)
    try {
      const response = await fetch('/api/tools/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.recognized) {
        setReturningUser({
          name: data.name,
          phone: data.phone,
          company: data.company,
        })
        // Pre-fill form with previous data
        setFormData(prev => ({
          ...prev,
          name: data.name || prev.name,
          phone: data.phone || prev.phone,
          company: data.company || prev.company,
        }))
      } else {
        setReturningUser(null)
      }
    } catch (err) {
      console.error('Failed to check email:', err)
      setReturningUser(null)
    } finally {
      setCheckingEmail(false)
    }
  }

  const handleEmailBlur = () => {
    checkEmail(formData.email)
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // First, check if this is a returning user (in case blur didn't fire)
      let isReturningUser = !!returningUser
      if (!isReturningUser && formData.email) {
        const checkResponse = await fetch('/api/tools/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        })
        const checkData = await checkResponse.json()
        if (checkData.recognized) {
          isReturningUser = true
          // Update form with previous data if not already filled
          if (!formData.name && checkData.name) {
            setFormData(prev => ({ ...prev, name: checkData.name }))
          }
        }
      }

      const response = await fetch(`${apiPrefix}/${mode === 'article' ? 'request' : 'download-request'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ...(mode === 'article' ? { articleId: itemId } : { toolId: itemId }),
          skipOtp: isReturningUser,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process request')
      }

      // If returning user, download directly
      if (data.skipOtp && data.downloadUrl) {
        setDownloadUrl(data.downloadUrl)
        setStep('success')

        // Auto-start download
        setTimeout(() => {
          if (data.downloadUrl) {
            window.open(data.downloadUrl, '_blank')
          }
        }, 500)
      } else {
        // Normal flow - go to OTP step
        setLeadId(data.leadId)
        setStep('otp')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${apiPrefix}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          otp,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP')
      }

      setDownloadUrl(data.downloadUrl)
      setStep('success')

      // Auto-start download after short delay
      setTimeout(() => {
        if (data.downloadUrl) {
          window.open(data.downloadUrl, '_blank')
        }
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${apiPrefix}/${mode === 'article' ? 'request' : 'download-request'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ...(mode === 'article' ? { articleId: itemId } : { toolId: itemId }),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP')
      }

      setLeadId(data.leadId)
      setError('') // Clear any previous error
      alert('OTP has been resent to your email')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep('form')
    setFormData({ name: '', email: '', phone: '', company: '' })
    setOtp('')
    setError('')
    setLeadId('')
    setDownloadUrl('')
    setReturningUser(null)
    onClose()
  }

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label={`Download ${itemName}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-white p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-6 w-6" />
          </button>
          <Download className="h-10 w-10 mb-3" />
          <h2 className="text-xl font-bold">Download {itemName}</h2>
          <p className="text-white/80 text-sm mt-1">
            {step === 'form' && (returningUser ? 'Welcome back!' : 'Enter your details to download')}
            {step === 'otp' && 'Verify your email to continue'}
            {step === 'success' && 'Download starting...'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Form */}
          {step === 'form' && (
            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Returning User Banner */}
              {returningUser && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Welcome back, {returningUser.name}!</p>
                      <p className="text-sm text-green-600">No OTP required. Click download to continue.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      setReturningUser(null) // Reset when email changes
                    }}
                    onBlur={handleEmailBlur}
                    placeholder="your@email.com"
                    required
                  />
                  {checkingEmail && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Your company name"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-light"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {returningUser ? 'Processing...' : 'Sending OTP...'}
                  </>
                ) : returningUser ? (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download Now
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send OTP to Email
                  </>
                )}
              </Button>

              {!returningUser && (
                <p className="text-xs text-center text-gray-500">
                  We'll send a verification code to your email
                </p>
              )}
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <p className="text-gray-600">
                  We've sent a 6-digit code to<br />
                  <strong>{formData.email}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-light"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Download'
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-sm text-primary hover:underline disabled:opacity-50"
                >
                  Didn't receive code? Resend OTP
                </button>
              </div>

              <p className="text-xs text-center text-gray-500">
                OTP is valid for 10 minutes
              </p>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {returningUser ? 'Download Started!' : 'Email Verified!'}
              </h3>
              <p className="text-gray-600 mb-6">
                Your download should start automatically.
              </p>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button className="bg-primary hover:bg-primary-light">
                    <Download className="h-4 w-4 mr-2" />
                    Download Again
                  </Button>
                </a>
              )}

              <div className="mt-4">
                <button
                  onClick={handleClose}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Close this window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
