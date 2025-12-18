'use client'

import { useState } from 'react'
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
  Twitter
} from 'lucide-react'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState('general')
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

  const handleSave = async () => {
    setSaving(true)
    // TODO: Implement settings save to database
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  const sections = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'hours', label: 'Hours', icon: Clock },
    { id: 'social', label: 'Social Media', icon: Share2 },
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
        </div>
      </div>
    </div>
  )
}
