'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { ArrowLeft, Save, Eye, Upload, File, X, Loader2, ImageIcon } from 'lucide-react'

// Dynamic import for RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import('@/components/editor/RichTextEditor').then(mod => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-48 border border-border-light rounded-md flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    )
  }
)

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

export default function NewToolPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const iconInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [iconUploading, setIconUploading] = useState(false)
  const [iconImage, setIconImage] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<{ name: string; path: string; size: number } | null>(null)
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (500MB)
    if (file.size > 500 * 1024 * 1024) {
      alert('File size exceeds 500MB limit. Please choose a smaller file.')
      return
    }

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('type', 'tools')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (response.ok) {
        const data = await response.json()
        setUploadedFile({
          name: file.name,
          path: data.filePath,
          size: data.fileSize,
        })
        setFormData({ ...formData, downloadUrl: data.filePath })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to upload file')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const removeUploadedFile = () => {
    setUploadedFile(null)
    setFormData({ ...formData, downloadUrl: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size exceeds 10MB limit.')
      return
    }

    setIconUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('type', 'tools')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (response.ok) {
        const data = await response.json()
        setIconImage(data.filePath)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Icon upload error:', error)
      alert('Failed to upload image')
    } finally {
      setIconUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleSubmit = async (e: React.FormEvent, activate: boolean = true) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          shortDescription: formData.shortDescription,
          longDescription: formData.longDescription,
          version: formData.version,
          category: formData.category,
          toolType: formData.toolType,
          licenseType: formData.licenseType,
          price: formData.price ? parseFloat(formData.price) : null,
          downloadUrl: formData.downloadUrl,
          requirements: formData.requirements.split('\n').map((r) => r.trim()).filter(Boolean),
          setupGuide: formData.setupGuide,
          features: formData.features.split('\n').map((f) => f.trim()).filter(Boolean),
          isActive: activate,
          iconImage: iconImage || null,
        }),
      })

      if (response.ok) {
        router.push('/admin/tools')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create tool')
      }
    } catch (error) {
      console.error('Failed to create tool:', error)
      alert('Failed to create tool')
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-3xl font-heading font-bold text-text-primary">Add New Tool</h1>
            <p className="text-text-muted mt-1">Create a new automation tool</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Inactive
          </Button>
          <Button
            className="bg-primary hover:bg-primary-light"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
          >
            <Eye className="h-4 w-4 mr-2" />
            Save & Activate
          </Button>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, true)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    onChange={handleNameChange}
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
                <RichTextEditor
                  content={formData.longDescription}
                  onChange={(html) => setFormData({ ...formData, longDescription: html })}
                  placeholder="Detailed description of the tool..."
                  className="min-h-[200px]"
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
                <RichTextEditor
                  content={formData.setupGuide}
                  onChange={(html) => setFormData({ ...formData, setupGuide: html })}
                  placeholder="Step-by-step installation instructions..."
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Editor Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle>Editor Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-text-muted space-y-2">
              <p><strong>Rich Text Editor:</strong> Use the toolbar to format your content.</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Copy-paste from Word with formatting preserved</li>
                <li>Add headings, bold, italic, underline</li>
                <li>Insert tables and lists</li>
                <li>Add links and images</li>
                <li>Highlight important text</li>
              </ul>
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
              <CardTitle>Tool Icon Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {iconImage ? (
                <div className="relative">
                  <Image
                    src={iconImage}
                    alt="Tool icon"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg border border-border-light"
                  />
                  <button
                    type="button"
                    onClick={() => { setIconImage(''); if (iconInputRef.current) iconInputRef.current.value = '' }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    iconUploading
                      ? 'border-primary bg-primary/5'
                      : 'border-border-light hover:border-primary hover:bg-primary/5'
                  }`}
                  onClick={() => !iconUploading && iconInputRef.current?.click()}
                >
                  <input
                    ref={iconInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleIconUpload}
                    accept="image/*"
                  />
                  {iconUploading ? (
                    <>
                      <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />
                      <p className="mt-2 text-sm text-text-muted">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-10 w-10 mx-auto text-text-muted" />
                      <p className="mt-2 text-sm font-medium text-text-primary">
                        Click to upload icon image
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        PNG, JPG, WebP (max 10MB). Used for social media posts.
                      </p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tool File Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload Area */}
              {!uploadedFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    uploading
                      ? 'border-primary bg-primary/5'
                      : 'border-border-light hover:border-primary hover:bg-primary/5'
                  }`}
                  onClick={() => !uploading && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".zip,.rar,.7z,.py,.xlsx,.xls,.exe,.msi"
                  />
                  {uploading ? (
                    <>
                      <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />
                      <p className="mt-2 text-sm text-text-muted">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 mx-auto text-text-muted" />
                      <p className="mt-2 text-sm font-medium text-text-primary">
                        Click to upload tool file
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        ZIP, RAR, 7Z, PY, XLSX, EXE (max 500MB)
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="border border-border-light rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <File className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary text-sm truncate max-w-[180px]">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatFileSize(uploadedFile.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeUploadedFile}
                      className="text-text-muted hover:text-red-500 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-3 p-2 bg-green-50 rounded text-xs text-green-700">
                    File uploaded successfully!
                  </div>
                </div>
              )}

              {/* Manual URL Input */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border-light" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-text-muted">Or enter URL manually</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="downloadUrl">Download URL</Label>
                <Input
                  id="downloadUrl"
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                  placeholder="/downloads/tool-name.zip"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
