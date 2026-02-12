'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Share2,
  Building2,
  MessageCircle,
  Loader2,
  CheckCircle,
  Facebook,
  Linkedin,
  Youtube,
  Twitter,
  Send,
  Eye,
  EyeOff,
  AlertCircle,
  Megaphone,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [testingSmtp, setTestingSmtp] = useState(false)
  const [smtpMessage, setSmtpMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [testEmail, setTestEmail] = useState('')
  const [smtpSettings, setSmtpSettings] = useState({
    host: 'smtp.gmail.com',
    port: '587',
    user: '',
    pass: '',
    fromName: 'Himanshu Majithiya & Co.',
    notificationEmail: '',
  })
  // Social media auto-post state
  const [savingSocial, setSavingSocial] = useState(false)
  const [socialMessage, setSocialMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showTwitterSecrets, setShowTwitterSecrets] = useState(false)
  const [showLinkedInToken, setShowLinkedInToken] = useState(false)
  const [showFacebookToken, setShowFacebookToken] = useState(false)
  const [socialSettings, setSocialSettings] = useState({
    twitter: { enabled: false, apiKey: '', apiSecret: '', accessToken: '', accessSecret: '' },
    linkedin: { enabled: false, accessToken: '', personUrn: '' },
    facebook: { enabled: false, pageAccessToken: '', pageId: '' },
    instagram: { enabled: false, instagramAccountId: '' },
  })
  const [settings, setSettings] = useState({
    siteName: 'Himanshu Majithiya & Co.',
    tagline: 'Chartered Accountants - Practicing Since 2007',
    email: 'info@himanshumajithiya.com',
    phone: '+91 98795 03465',
    mobile: '+91 98795 03465',
    address: '507-508, Maple Trade Centre, SAL Hospital Road, Near Surdhara Circle, Thaltej, Ahmedabad, Gujarat - 380059',
    workingHours: 'Monday to Friday: 11:00 AM to 6:00 PM',
    googleMapsUrl: 'https://maps.google.com/?q=507-508+Maple+Trade+Centre+Thaltej+Ahmedabad',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61580046548872',
    linkedinUrl: 'https://www.linkedin.com/in/himanshu-majithiya-b86a73381',
    twitterUrl: '',
    youtubeUrl: 'https://www.youtube.com/@himanshumajithiya4349',
    whatsapp: '+919879503465',
  })

  // Fetch settings on mount
  useEffect(() => {
    fetchSmtpSettings()
    fetchSocialSettings()
  }, [])

  const fetchSmtpSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/smtp')
      if (response.ok) {
        const data = await response.json()
        setSmtpSettings(data.settings)
        setTestEmail(data.settings.notificationEmail || data.settings.user || '')
      }
    } catch (error) {
      console.error('Failed to fetch SMTP settings:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    // TODO: Implement settings save to database
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  const handleSaveSmtp = async () => {
    setSaving(true)
    setSmtpMessage(null)

    try {
      const response = await fetch('/api/admin/settings/smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpSettings),
      })

      const data = await response.json()

      if (response.ok) {
        setSmtpMessage({ type: 'success', text: 'SMTP settings saved successfully!' })
      } else {
        setSmtpMessage({ type: 'error', text: data.error || 'Failed to save settings' })
      }
    } catch (error) {
      setSmtpMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  const handleTestSmtp = async () => {
    if (!testEmail) {
      setSmtpMessage({ type: 'error', text: 'Please enter a test email address' })
      return
    }

    setTestingSmtp(true)
    setSmtpMessage(null)

    try {
      const response = await fetch('/api/admin/settings/smtp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setSmtpMessage({ type: 'success', text: `Test email sent successfully to ${testEmail}` })
      } else {
        setSmtpMessage({ type: 'error', text: data.error || 'Failed to send test email' })
      }
    } catch (error) {
      setSmtpMessage({ type: 'error', text: 'Failed to send test email' })
    } finally {
      setTestingSmtp(false)
    }
  }

  const fetchSocialSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/social')
      if (response.ok) {
        const data = await response.json()
        setSocialSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to fetch social settings:', error)
    }
  }

  const handleSaveSocial = async () => {
    setSavingSocial(true)
    setSocialMessage(null)

    try {
      const response = await fetch('/api/admin/settings/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialSettings),
      })

      const data = await response.json()

      if (response.ok) {
        setSocialMessage({ type: 'success', text: 'Social media settings saved successfully!' })
        fetchSocialSettings() // Refresh to show masked tokens
      } else {
        setSocialMessage({ type: 'error', text: data.error || 'Failed to save settings' })
      }
    } catch (error) {
      setSocialMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSavingSocial(false)
    }
  }

  const sections = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'hours', label: 'Hours', icon: Clock },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'autopost', label: 'Auto-Post', icon: Megaphone },
    { id: 'email', label: 'Email (SMTP)', icon: Mail },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your website configuration</p>
        </div>
        <Button
          className={`shadow-sm transition-all ${
            saved
              ? 'bg-emerald-500 hover:bg-emerald-600'
              : 'bg-primary hover:bg-primary/90'
          }`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {/* Navigation Tabs */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-2">
          <div className="flex items-center gap-1 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeSection === section.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Quick Info */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{settings.siteName}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{settings.tagline}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm text-slate-900 truncate">{settings.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone</p>
                  <p className="text-sm text-slate-900">{settings.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Hours</p>
                  <p className="text-sm text-slate-900">{settings.workingHours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Location</p>
                  <p className="text-sm text-slate-900 line-clamp-2">{settings.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          {activeSection === 'general' && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">General Settings</CardTitle>
                    <CardDescription>Basic website information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-sm font-medium text-slate-700">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="bg-slate-50 border-slate-200 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline" className="text-sm font-medium text-slate-700">Tagline</Label>
                  <Input
                    id="tagline"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="bg-slate-50 border-slate-200 focus:bg-white"
                  />
                  <p className="text-xs text-slate-500">A short description that appears below your site name</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          {activeSection === 'contact' && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                    <CardDescription>How clients can reach you</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="phone"
                        className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-sm font-medium text-slate-700">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="mobile"
                        className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                        value={settings.mobile}
                        onChange={(e) => setSettings({ ...settings, mobile: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-sm font-medium text-slate-700">WhatsApp Number</Label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="whatsapp"
                      placeholder="+919876543210"
                      className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                      value={settings.whatsapp}
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    />
                  </div>
                  <p className="text-xs text-slate-500">Include country code without spaces or special characters</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Address */}
          {activeSection === 'address' && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Address</CardTitle>
                    <CardDescription>Office location details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-slate-700">Full Address</Label>
                  <textarea
                    id="address"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white resize-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="googleMapsUrl" className="text-sm font-medium text-slate-700">Google Maps URL</Label>
                  <Input
                    id="googleMapsUrl"
                    placeholder="https://maps.google.com/..."
                    value={settings.googleMapsUrl}
                    onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                    className="bg-slate-50 border-slate-200 focus:bg-white"
                  />
                  <p className="text-xs text-slate-500">Paste the full Google Maps share link for your office</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Working Hours */}
          {activeSection === 'hours' && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Working Hours</CardTitle>
                    <CardDescription>Office timings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="workingHours" className="text-sm font-medium text-slate-700">Working Hours</Label>
                  <Input
                    id="workingHours"
                    value={settings.workingHours}
                    onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                    className="bg-slate-50 border-slate-200 focus:bg-white"
                  />
                  <p className="text-xs text-slate-500">E.g., &quot;Monday to Friday: 9:00 AM to 6:00 PM&quot;</p>
                </div>

                {/* Preset Schedule */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Quick Presets</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Monday to Friday: 9:00 AM to 6:00 PM',
                      'Monday to Saturday: 10:00 AM to 7:00 PM',
                      'Monday to Friday: 11:00 AM to 6:00 PM',
                    ].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setSettings({ ...settings, workingHours: preset })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          settings.workingHours === preset
                            ? 'bg-primary text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Media */}
          {activeSection === 'social' && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                    <Share2 className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Social Media Links</CardTitle>
                    <CardDescription>Connect your social profiles</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="facebookUrl" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-blue-600" />
                      Facebook
                    </Label>
                    <Input
                      id="facebookUrl"
                      placeholder="https://facebook.com/..."
                      value={settings.facebookUrl}
                      onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                      className="bg-slate-50 border-slate-200 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-blue-700" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedinUrl"
                      placeholder="https://linkedin.com/..."
                      value={settings.linkedinUrl}
                      onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                      className="bg-slate-50 border-slate-200 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtubeUrl" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Youtube className="h-4 w-4 text-red-600" />
                      YouTube
                    </Label>
                    <Input
                      id="youtubeUrl"
                      placeholder="https://youtube.com/..."
                      value={settings.youtubeUrl}
                      onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                      className="bg-slate-50 border-slate-200 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitterUrl" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-slate-800" />
                      Twitter / X
                    </Label>
                    <Input
                      id="twitterUrl"
                      placeholder="https://twitter.com/..."
                      value={settings.twitterUrl}
                      onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                      className="bg-slate-50 border-slate-200 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Social Preview */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Connected Profiles</h4>
                  <div className="flex flex-wrap gap-2">
                    {settings.facebookUrl && (
                      <a
                        href={settings.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                      >
                        <Facebook className="h-3.5 w-3.5" />
                        Facebook
                      </a>
                    )}
                    {settings.linkedinUrl && (
                      <a
                        href={settings.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                        LinkedIn
                      </a>
                    )}
                    {settings.youtubeUrl && (
                      <a
                        href={settings.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                      >
                        <Youtube className="h-3.5 w-3.5" />
                        YouTube
                      </a>
                    )}
                    {settings.twitterUrl && (
                      <a
                        href={settings.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors"
                      >
                        <Twitter className="h-3.5 w-3.5" />
                        Twitter
                      </a>
                    )}
                    {!settings.facebookUrl && !settings.linkedinUrl && !settings.youtubeUrl && !settings.twitterUrl && (
                      <p className="text-sm text-slate-500">No social profiles connected yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Auto-Post Settings */}
          {activeSection === 'autopost' && (
            <>
              {socialMessage && (
                <div
                  className={`p-4 rounded-lg flex items-center gap-3 ${
                    socialMessage.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}
                >
                  {socialMessage.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  )}
                  <span>{socialMessage.text}</span>
                </div>
              )}

              {/* X (Twitter) Settings */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Twitter className="h-5 w-5 text-slate-800" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">X (Twitter)</CardTitle>
                        <CardDescription>Auto-post blogs to X/Twitter</CardDescription>
                      </div>
                    </div>
                    <button
                      onClick={() => setSocialSettings({
                        ...socialSettings,
                        twitter: { ...socialSettings.twitter, enabled: !socialSettings.twitter.enabled }
                      })}
                      className="flex items-center gap-2"
                    >
                      {socialSettings.twitter.enabled ? (
                        <ToggleRight className="h-8 w-8 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-8 w-8 text-slate-300" />
                      )}
                    </button>
                  </div>
                </CardHeader>
                {socialSettings.twitter.enabled && (
                  <CardContent className="space-y-4 pt-0">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">API Key (Consumer Key)</Label>
                      <Input
                        value={socialSettings.twitter.apiKey}
                        onChange={(e) => setSocialSettings({
                          ...socialSettings,
                          twitter: { ...socialSettings.twitter, apiKey: e.target.value }
                        })}
                        placeholder="Enter API Key"
                        className="bg-slate-50 border-slate-200 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">API Secret (Consumer Secret)</Label>
                      <div className="relative">
                        <Input
                          type={showTwitterSecrets ? 'text' : 'password'}
                          value={socialSettings.twitter.apiSecret}
                          onChange={(e) => setSocialSettings({
                            ...socialSettings,
                            twitter: { ...socialSettings.twitter, apiSecret: e.target.value }
                          })}
                          placeholder="Enter API Secret"
                          className="bg-slate-50 border-slate-200 focus:bg-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowTwitterSecrets(!showTwitterSecrets)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showTwitterSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Access Token</Label>
                      <Input
                        type={showTwitterSecrets ? 'text' : 'password'}
                        value={socialSettings.twitter.accessToken}
                        onChange={(e) => setSocialSettings({
                          ...socialSettings,
                          twitter: { ...socialSettings.twitter, accessToken: e.target.value }
                        })}
                        placeholder="Enter Access Token"
                        className="bg-slate-50 border-slate-200 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Access Token Secret</Label>
                      <Input
                        type={showTwitterSecrets ? 'text' : 'password'}
                        value={socialSettings.twitter.accessSecret}
                        onChange={(e) => setSocialSettings({
                          ...socialSettings,
                          twitter: { ...socialSettings.twitter, accessSecret: e.target.value }
                        })}
                        placeholder="Enter Access Token Secret"
                        className="bg-slate-50 border-slate-200 focus:bg-white"
                      />
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Setup Guide:</h4>
                      <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                        <li>Go to <a href="https://developer.x.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">developer.x.com</a> and sign up for a Developer account</li>
                        <li>Create a new Project and App</li>
                        <li>Set App permissions to &quot;Read and Write&quot;</li>
                        <li>Go to &quot;Keys and Tokens&quot; tab</li>
                        <li>Copy API Key, API Secret, Access Token, and Access Token Secret</li>
                      </ol>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* LinkedIn Settings */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Linkedin className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">LinkedIn</CardTitle>
                        <CardDescription>Auto-post blogs to LinkedIn</CardDescription>
                      </div>
                    </div>
                    <button
                      onClick={() => setSocialSettings({
                        ...socialSettings,
                        linkedin: { ...socialSettings.linkedin, enabled: !socialSettings.linkedin.enabled }
                      })}
                      className="flex items-center gap-2"
                    >
                      {socialSettings.linkedin.enabled ? (
                        <ToggleRight className="h-8 w-8 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-8 w-8 text-slate-300" />
                      )}
                    </button>
                  </div>
                </CardHeader>
                {socialSettings.linkedin.enabled && (
                  <CardContent className="space-y-4 pt-0">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Access Token</Label>
                      <div className="relative">
                        <Input
                          type={showLinkedInToken ? 'text' : 'password'}
                          value={socialSettings.linkedin.accessToken}
                          onChange={(e) => setSocialSettings({
                            ...socialSettings,
                            linkedin: { ...socialSettings.linkedin, accessToken: e.target.value }
                          })}
                          placeholder="Enter LinkedIn Access Token"
                          className="bg-slate-50 border-slate-200 focus:bg-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLinkedInToken(!showLinkedInToken)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showLinkedInToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Person/Organization URN</Label>
                      <Input
                        value={socialSettings.linkedin.personUrn}
                        onChange={(e) => setSocialSettings({
                          ...socialSettings,
                          linkedin: { ...socialSettings.linkedin, personUrn: e.target.value }
                        })}
                        placeholder="urn:li:person:XXXXX or urn:li:organization:XXXXX"
                        className="bg-slate-50 border-slate-200 focus:bg-white"
                      />
                      <p className="text-xs text-slate-500">Your LinkedIn Person URN or Company Page Organization URN</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Setup Guide:</h4>
                      <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                        <li>Go to <a href="https://www.linkedin.com/developers" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">linkedin.com/developers</a> and create an App</li>
                        <li>Associate with your LinkedIn Page</li>
                        <li>Request &quot;Share on LinkedIn&quot; (w_member_social) permission</li>
                        <li>Generate an OAuth 2.0 Access Token</li>
                        <li>Find your Person URN from the LinkedIn API</li>
                      </ol>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Facebook Page Settings */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Facebook className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Facebook Page</CardTitle>
                        <CardDescription>Auto-post blogs to your Facebook Page</CardDescription>
                      </div>
                    </div>
                    <button
                      onClick={() => setSocialSettings({
                        ...socialSettings,
                        facebook: { ...socialSettings.facebook, enabled: !socialSettings.facebook.enabled }
                      })}
                      className="flex items-center gap-2"
                    >
                      {socialSettings.facebook.enabled ? (
                        <ToggleRight className="h-8 w-8 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-8 w-8 text-slate-300" />
                      )}
                    </button>
                  </div>
                </CardHeader>
                {socialSettings.facebook.enabled && (
                  <CardContent className="space-y-4 pt-0">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Page Access Token</Label>
                      <div className="relative">
                        <Input
                          type={showFacebookToken ? 'text' : 'password'}
                          value={socialSettings.facebook.pageAccessToken}
                          onChange={(e) => setSocialSettings({
                            ...socialSettings,
                            facebook: { ...socialSettings.facebook, pageAccessToken: e.target.value }
                          })}
                          placeholder="Enter Facebook Page Access Token"
                          className="bg-slate-50 border-slate-200 focus:bg-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowFacebookToken(!showFacebookToken)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showFacebookToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Page ID</Label>
                      <Input
                        value={socialSettings.facebook.pageId}
                        onChange={(e) => setSocialSettings({
                          ...socialSettings,
                          facebook: { ...socialSettings.facebook, pageId: e.target.value }
                        })}
                        placeholder="Enter Facebook Page ID"
                        className="bg-slate-50 border-slate-200 focus:bg-white"
                      />
                      <p className="text-xs text-slate-500">Found in your Page&apos;s About section or Page Settings</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <h4 className="text-sm font-medium text-amber-800 mb-1">Requires Meta App Review</h4>
                      <p className="text-xs text-amber-700">Facebook Page posting needs the <code className="bg-amber-100 px-1 rounded">pages_manage_posts</code> permission which requires Meta App Review. Without approval, it only works in Development Mode (test users only).</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Setup Guide:</h4>
                      <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                        <li>Go to <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">developers.facebook.com</a> and create an App</li>
                        <li>Add &quot;Facebook Login&quot; product and configure permissions</li>
                        <li>Request <code className="bg-slate-100 px-1 rounded">pages_manage_posts</code> and <code className="bg-slate-100 px-1 rounded">pages_read_engagement</code></li>
                        <li>Submit for App Review (required for production use)</li>
                        <li>Generate a long-lived Page Access Token</li>
                        <li>Find your Page ID from your Page&apos;s About section</li>
                      </ol>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Instagram Settings */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                        <svg className="h-5 w-5 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Instagram</CardTitle>
                        <CardDescription>Auto-post blog cover images to Instagram</CardDescription>
                      </div>
                    </div>
                    <button
                      onClick={() => setSocialSettings({
                        ...socialSettings,
                        instagram: { ...socialSettings.instagram, enabled: !socialSettings.instagram.enabled }
                      })}
                      className="flex items-center gap-2"
                    >
                      {socialSettings.instagram.enabled ? (
                        <ToggleRight className="h-8 w-8 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-8 w-8 text-slate-300" />
                      )}
                    </button>
                  </div>
                </CardHeader>
                {socialSettings.instagram.enabled && (
                  <CardContent className="space-y-4 pt-0">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Instagram Business Account ID</Label>
                      <Input
                        value={socialSettings.instagram.instagramAccountId}
                        onChange={(e) => setSocialSettings({
                          ...socialSettings,
                          instagram: { ...socialSettings.instagram, instagramAccountId: e.target.value }
                        })}
                        placeholder="Enter Instagram Business Account ID"
                        className="bg-slate-50 border-slate-200 focus:bg-white"
                      />
                      <p className="text-xs text-slate-500">This is your Instagram Business Account ID from the Facebook Graph API, not your username</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <h4 className="text-sm font-medium text-amber-800 mb-1">Requirements</h4>
                      <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
                        <li>Instagram Business or Creator Account (not Personal)</li>
                        <li>Facebook Page linked to the Instagram account</li>
                        <li>Facebook App with <code className="bg-amber-100 px-1 rounded">instagram_basic</code> and <code className="bg-amber-100 px-1 rounded">instagram_content_publish</code> permissions</li>
                        <li>Meta App Review approval for production use</li>
                        <li>Blog posts must have a cover image (Instagram requires an image)</li>
                        <li>Uses the same Facebook Page Access Token configured above</li>
                      </ul>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Setup Guide:</h4>
                      <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                        <li>Convert your Instagram account to a Business or Creator account</li>
                        <li>Link it to your Facebook Page</li>
                        <li>In your Meta Developer App, add Instagram Graph API product</li>
                        <li>Request <code className="bg-slate-100 px-1 rounded">instagram_basic</code> and <code className="bg-slate-100 px-1 rounded">instagram_content_publish</code></li>
                        <li>Submit for App Review</li>
                        <li>Use the Graph API Explorer to find your Instagram Business Account ID</li>
                        <li>Ensure the Facebook Page Access Token (above) includes Instagram permissions</li>
                      </ol>
                    </div>
                  </CardContent>
                )}
              </Card>

              <Button
                onClick={handleSaveSocial}
                className="bg-primary hover:bg-primary/90"
                disabled={savingSocial}
              >
                {savingSocial ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Auto-Post Settings
                  </>
                )}
              </Button>
            </>
          )}

          {/* Email/SMTP Settings */}
          {activeSection === 'email' && (
            <>
              {smtpMessage && (
                <div
                  className={`p-4 rounded-lg flex items-center gap-3 ${
                    smtpMessage.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}
                >
                  {smtpMessage.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  )}
                  <span>{smtpMessage.text}</span>
                </div>
              )}

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Email (SMTP) Settings</CardTitle>
                      <CardDescription>Configure email for notifications</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost" className="text-sm font-medium text-slate-700">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        value={smtpSettings.host}
                        onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                        placeholder="smtp.gmail.com"
                        className="bg-slate-50 border-slate-200 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort" className="text-sm font-medium text-slate-700">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        value={smtpSettings.port}
                        onChange={(e) => setSmtpSettings({ ...smtpSettings, port: e.target.value })}
                        placeholder="587"
                        className="bg-slate-50 border-slate-200 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpUser" className="text-sm font-medium text-slate-700">Email Address (Username)</Label>
                    <Input
                      id="smtpUser"
                      type="email"
                      value={smtpSettings.user}
                      onChange={(e) => setSmtpSettings({ ...smtpSettings, user: e.target.value })}
                      placeholder="your-email@gmail.com"
                      className="bg-slate-50 border-slate-200 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPass" className="text-sm font-medium text-slate-700">App Password</Label>
                    <div className="relative">
                      <Input
                        id="smtpPass"
                        type={showPassword ? 'text' : 'password'}
                        value={smtpSettings.pass}
                        onChange={(e) => setSmtpSettings({ ...smtpSettings, pass: e.target.value })}
                        placeholder="Enter app password"
                        className="bg-slate-50 border-slate-200 focus:bg-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      For Gmail: Use an App Password (not your regular password).{' '}
                      <a
                        href="https://myaccount.google.com/apppasswords"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Generate App Password
                      </a>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpFromName" className="text-sm font-medium text-slate-700">From Name</Label>
                      <Input
                        id="smtpFromName"
                        value={smtpSettings.fromName}
                        onChange={(e) => setSmtpSettings({ ...smtpSettings, fromName: e.target.value })}
                        placeholder="Himanshu Majithiya & Co."
                        className="bg-slate-50 border-slate-200 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notificationEmail" className="text-sm font-medium text-slate-700">Notification Email</Label>
                      <Input
                        id="notificationEmail"
                        type="email"
                        value={smtpSettings.notificationEmail}
                        onChange={(e) => setSmtpSettings({ ...smtpSettings, notificationEmail: e.target.value })}
                        placeholder="admin@yoursite.com"
                        className="bg-slate-50 border-slate-200 focus:bg-white"
                      />
                      <p className="text-xs text-slate-500">Where to receive notifications</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveSmtp}
                    className="bg-primary hover:bg-primary/90"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save SMTP Settings
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Test Email Card */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Send className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Test Email</CardTitle>
                      <CardDescription>Send a test email to verify configuration</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="test@example.com"
                      className="bg-slate-50 border-slate-200 focus:bg-white"
                    />
                    <Button
                      variant="outline"
                      onClick={handleTestSmtp}
                      disabled={testingSmtp || !testEmail}
                    >
                      {testingSmtp ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Test
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Gmail Setup Guide:</h4>
                    <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                      <li>Enable 2-Factor Authentication on Google Account</li>
                      <li>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">App Passwords</a></li>
                      <li>Create app password for "Mail"</li>
                      <li>Copy the 16-character password</li>
                      <li>Paste it in the "App Password" field above</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
