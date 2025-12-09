'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Eye, EyeOff, Trash2 } from 'lucide-react'

const categories = [
  { value: 'DOCUMENT_AUTOMATION', label: 'Document Automation' },
  { value: 'DATA_PROCESSING', label: 'Data Processing' },
  { value: 'REDACTION', label: 'Redaction' },
  { value: 'TAX_TOOLS', label: 'Tax Tools' },
  { value: 'COMPLIANCE', label: 'Compliance' },
  { value: 'UTILITY', label: 'Utility' },
  { value: 'OTHER', label: 'Other' },
]

const toolTypes = [
  { value: 'WEB_APP', label: 'Web Application' },
  { value: 'DOWNLOADABLE', label: 'Downloadable (Python/Excel)' },
  { value: 'ONLINE', label: 'Online (Web-based)' },
  { value: 'HYBRID', label: 'Hybrid (Both)' },
]

const licenseTypes = [
  { value: 'FREE', label: 'Free' },
  { value: 'ONE_TIME', label: 'One-time Purchase' },
  { value: 'ANNUAL', label: 'Annual License' },
  { value: 'MONTHLY', label: 'Monthly License' },
]

export default function EditToolPage() {
  const router = useRouter()
  const params = useParams()
  const toolId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    longDescription: '',
    version: '1.0.0',
    category: 'UTILITY',
    toolType: 'DOWNLOADABLE',
    licenseType: 'FREE',
    price: '',
    downloadUrl: '',
    requirements: '',
    setupGuide: '',
    features: '',
    isActive: true,
  })

  useEffect(() => {
    fetchTool()
  }, [toolId])

  const fetchTool = async () => {
    try {
      const response = await fetch(`/api/admin/tools/${toolId}`)
      if (response.ok) {
        const tool = await response.json()
        setFormData({
          name: tool.name,
          slug: tool.slug,
          shortDescription: tool.shortDescription,
          longDescription: tool.longDescription || '',
          version: tool.version || '1.0.0',
          category: tool.category,
          toolType: tool.toolType,
          licenseType: tool.licenseType,
          price: tool.price ? tool.price.toString() : '',
          downloadUrl: tool.downloadUrl || '',
          requirements: tool.requirements?.join('\n') || '',
          setupGuide: tool.setupGuide || '',
          features: tool.features?.join('\n') || '',
          isActive: tool.isActive,
        })
      } else {
        alert('Tool not found')
        router.push('/admin/tools')
      }
    } catch (error) {
      console.error('Failed to fetch tool:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, activate?: boolean) => {
    e.preventDefault()
    setSaving(true)

    const isActive = activate !== undefined ? activate : formData.isActive

    try {
      const response = await fetch(`/api/admin/tools/${toolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          features: formData.features.split('\n').map((f) => f.trim()).filter(Boolean),
          requirements: formData.requirements.split('\n').map((r) => r.trim()).filter(Boolean),
          isActive,
        }),
      })

      if (response.ok) {
        setFormData({ ...formData, isActive })
        alert('Tool updated successfully!')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update tool')
      }
    } catch (error) {
      console.error('Failed to update tool:', error)
      alert('Failed to update tool')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tool? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/tools/${toolId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/tools')
      } else {
        alert('Failed to delete tool')
      }
    } catch (error) {
      console.error('Failed to delete tool:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/tools">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary">Edit Tool</h1>
            <p className="text-text-muted mt-1">Update tool details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button
            variant="outline"
            onClick={(e) => handleSubmit(e)}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          {formData.isActive ? (
            <Button
              variant="outline"
              onClick={(e) => handleSubmit(e, false)}
              disabled={saving}
            >
              <EyeOff className="h-4 w-4 mr-2" />
              Deactivate
            </Button>
          ) : (
            <Button
              className="bg-primary hover:bg-primary-light"
              onClick={(e) => handleSubmit(e, true)}
              disabled={saving}
            >
              <Eye className="h-4 w-4 mr-2" />
              Activate
            </Button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
        formData.isActive ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
      }`}>
        {formData.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        {formData.isActive ? 'Active' : 'Inactive'}
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tool Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tool Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Bank Statement Converter"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="1.0.0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted text-sm">/tools/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="bank-statement-converter"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description *</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief description for listings"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDescription">Full Description</Label>
                <textarea
                  id="longDescription"
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  placeholder="Detailed description of the tool..."
                  rows={6}
                  className="w-full px-3 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="OCR technology&#10;Auto-categorization&#10;Multi-bank support"
                  rows={5}
                  className="w-full px-3 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">System Requirements (one per line)</Label>
                <textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Python 3.8+&#10;Windows/Mac/Linux"
                  rows={3}
                  className="w-full px-3 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="setupGuide">Setup Guide</Label>
                <textarea
                  id="setupGuide"
                  value={formData.setupGuide}
                  onChange={(e) => setFormData({ ...formData, setupGuide: e.target.value })}
                  placeholder="Step-by-step installation instructions..."
                  rows={5}
                  className="w-full px-3 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toolType">Tool Type *</Label>
                <select
                  id="toolType"
                  value={formData.toolType}
                  onChange={(e) => setFormData({ ...formData, toolType: e.target.value })}
                  className="w-full px-3 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {toolTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Licensing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="licenseType">License Type *</Label>
                <select
                  id="licenseType"
                  value={formData.licenseType}
                  onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                  className="w-full px-3 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {licenseTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.licenseType !== 'FREE' && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price (INR)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="999"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Download</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="downloadUrl">Download URL</Label>
                <Input
                  id="downloadUrl"
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                  placeholder="/downloads/tool-name.zip"
                />
                <p className="text-xs text-text-muted">
                  Upload the file to /public/downloads/ and enter the path here
                </p>
              </div>
            </CardContent>
          </Card>

          {formData.isActive && (
            <Card>
              <CardHeader>
                <CardTitle>View Tool</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/tools/${formData.slug}`} target="_blank">
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View on Website
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </form>
    </div>
  )
}
