'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Globe, Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
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
      alert('Settings saved successfully!')
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">Settings</h1>
          <p className="text-text-muted mt-1">Manage your website settings</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-light"
          onClick={handleSave}
          disabled={saving}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic website information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>How clients can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  id="phone"
                  className="pl-10"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  id="mobile"
                  className="pl-10"
                  value={settings.mobile}
                  onChange={(e) => setSettings({ ...settings, mobile: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address
            </CardTitle>
            <CardDescription>Office location details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <textarea
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
              <Input
                id="googleMapsUrl"
                placeholder="https://maps.google.com/..."
                value={settings.googleMapsUrl}
                onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Working Hours
            </CardTitle>
            <CardDescription>Office timings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workingHours">Working Hours</Label>
              <Input
                id="workingHours"
                value={settings.workingHours}
                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Connect your social profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook</Label>
                <Input
                  id="facebookUrl"
                  placeholder="https://facebook.com/..."
                  value={settings.facebookUrl}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn</Label>
                <Input
                  id="linkedinUrl"
                  placeholder="https://linkedin.com/..."
                  value={settings.linkedinUrl}
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube</Label>
                <Input
                  id="youtubeUrl"
                  placeholder="https://youtube.com/..."
                  value={settings.youtubeUrl}
                  onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitterUrl">Twitter / X</Label>
                <Input
                  id="twitterUrl"
                  placeholder="https://twitter.com/..."
                  value={settings.twitterUrl}
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  placeholder="+919876543210"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
