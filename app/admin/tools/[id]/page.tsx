'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { ArrowLeft, Save, Eye, EyeOff, Trash2, Upload, File, X, Loader2, Mail, ImageIcon, Twitter, Linkedin, Facebook, RefreshCw, CheckCircle, XCircle, Clock, Send } from 'lucide-react'

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

export default function EditToolPage() {
  const router = useRouter()
  const params = useParams()
  const toolId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)
  const iconInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [iconUploading, setIconUploading] = useState(false)
  const [iconImage, setIconImage] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<{ name: string; path: string; size: number } | null>(null)
  const [notifyUsers, setNotifyUsers] = useState(true)
  const [originalDownloadUrl, setOriginalDownloadUrl] = useState('')
  const [socialPosts, setSocialPosts] = useState<Array<{
    id: string
    platform: string
    status: string
    postUrl: string | null
    error: string | null
    createdAt: string
  }>>([])
  const [retrying, setRetrying] = useState<string | null>(null)
  const [manualPosting, setManualPosting] = useState<string | null>(null)
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
    fetchSocialPosts()
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
        setOriginalDownloadUrl(tool.downloadUrl || '')
        setIconImage(tool.iconImage || '')
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
    const fileChanged = formData.downloadUrl !== originalDownloadUrl

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
          notifyUsers: fileChanged && notifyUsers,
          iconImage: iconImage || null,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setFormData({ ...formData, isActive })
        setOriginalDownloadUrl(formData.downloadUrl)
        setUploadedFile(null)

        if (result.notificationsSent > 0) {
          alert(`Tool updated successfully! ${result.notificationsSent} user(s) notified about the update.`)
        } else {
          alert('Tool updated successfully!')
        }
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
      // Send old file path so it can be deleted after successful upload
      if (formData.downloadUrl) {
        uploadFormData.append('oldFilePath', formData.downloadUrl)
      }

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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
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

  const fetchSocialPosts = async () => {
    try {
      const response = await fetch(`/api/admin/tools/${toolId}/social`)
      if (response.ok) {
        const data = await response.json()
        setSocialPosts(data)
      }
    } catch (error) {
      console.error('Failed to fetch social posts:', error)
    }
  }

  const handleManualPost = async (platform: string) => {
    setManualPosting(platform)
    try {
      const response = await fetch(`/api/admin/tools/${toolId}/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      })
      if (response.ok) {
        fetchSocialPosts()
      } else {
        const data = await response.json()
        alert(data.error || 'Post failed')
      }
    } catch (error) {
      alert('Failed to post')
    } finally {
      setManualPosting(null)
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
              {/* Current File Info */}
              {formData.downloadUrl && !uploadedFile && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">Current file:</p>
                  <p className="text-xs text-blue-600 truncate">{formData.downloadUrl}</p>
                </div>
              )}

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
                        {formData.downloadUrl ? 'Click to replace file' : 'Click to upload file'}
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
                    New file uploaded! Click Save to apply changes.
                  </div>

                  {/* Notify Users Checkbox */}
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyUsers}
                        onChange={(e) => setNotifyUsers(e.target.checked)}
                        className="mt-0.5 rounded border-blue-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">Notify users</span>
                        </div>
                        <p className="text-xs text-blue-600 mt-1">
                          Send email to all users who previously downloaded this tool
                        </p>
                      </div>
                    </label>
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

          {/* Social Media Posts */}
          {formData.isActive && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Twitter */}
                {(() => {
                  const post = socialPosts.find(p => p.platform === 'TWITTER')
                  return (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-slate-800" />
                        <span className="text-sm font-medium">X / Twitter</span>
                      </div>
                      {post ? (
                        <div className="flex items-center gap-2">
                          {post.status === 'POSTED' && (
                            <>
                              <a href={post.postUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                                <CheckCircle className="h-3.5 w-3.5" /> Posted
                              </a>
                              <button onClick={() => handleManualPost('TWITTER')} disabled={manualPosting === 'TWITTER'} className="p-1 text-slate-500 hover:text-primary" title="Repost">
                                {manualPosting === 'TWITTER' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                              </button>
                            </>
                          )}
                          {post.status === 'FAILED' && (
                            <span className="text-xs text-red-600 flex items-center gap-1" title={post.error || ''}>
                              <XCircle className="h-3.5 w-3.5" /> Failed
                              <button onClick={() => handleManualPost('TWITTER')} disabled={manualPosting === 'TWITTER'} className="p-1 text-slate-500 hover:text-primary" title="Retry">
                                <RefreshCw className={`h-3.5 w-3.5 ${manualPosting === 'TWITTER' ? 'animate-spin' : ''}`} />
                              </button>
                            </span>
                          )}
                          {post.status === 'PENDING' && (
                            <span className="text-xs text-yellow-600 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Pending</span>
                          )}
                        </div>
                      ) : (
                        <button onClick={() => handleManualPost('TWITTER')} disabled={manualPosting === 'TWITTER'} className="text-xs text-primary hover:underline flex items-center gap-1">
                          {manualPosting === 'TWITTER' ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Post Now'}
                        </button>
                      )}
                    </div>
                  )
                })()}

                {/* LinkedIn */}
                {(() => {
                  const post = socialPosts.find(p => p.platform === 'LINKEDIN')
                  return (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-blue-700" />
                        <span className="text-sm font-medium">LinkedIn</span>
                      </div>
                      {post ? (
                        <div className="flex items-center gap-2">
                          {post.status === 'POSTED' && (
                            <>
                              <a href={post.postUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                                <CheckCircle className="h-3.5 w-3.5" /> Posted
                              </a>
                              <button onClick={() => handleManualPost('LINKEDIN')} disabled={manualPosting === 'LINKEDIN'} className="p-1 text-slate-500 hover:text-primary" title="Repost">
                                {manualPosting === 'LINKEDIN' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                              </button>
                            </>
                          )}
                          {post.status === 'FAILED' && (
                            <span className="text-xs text-red-600 flex items-center gap-1" title={post.error || ''}>
                              <XCircle className="h-3.5 w-3.5" /> Failed
                              <button onClick={() => handleManualPost('LINKEDIN')} disabled={manualPosting === 'LINKEDIN'} className="p-1 text-slate-500 hover:text-primary" title="Retry">
                                <RefreshCw className={`h-3.5 w-3.5 ${manualPosting === 'LINKEDIN' ? 'animate-spin' : ''}`} />
                              </button>
                            </span>
                          )}
                          {post.status === 'PENDING' && (
                            <span className="text-xs text-yellow-600 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Pending</span>
                          )}
                        </div>
                      ) : (
                        <button onClick={() => handleManualPost('LINKEDIN')} disabled={manualPosting === 'LINKEDIN'} className="text-xs text-primary hover:underline flex items-center gap-1">
                          {manualPosting === 'LINKEDIN' ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Post Now'}
                        </button>
                      )}
                    </div>
                  )
                })()}

                {/* Facebook */}
                {(() => {
                  const post = socialPosts.find(p => p.platform === 'FACEBOOK')
                  return (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Facebook</span>
                      </div>
                      {post ? (
                        <div className="flex items-center gap-2">
                          {post.status === 'POSTED' && (
                            <>
                              <a href={post.postUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                                <CheckCircle className="h-3.5 w-3.5" /> Posted
                              </a>
                              <button onClick={() => handleManualPost('FACEBOOK')} disabled={manualPosting === 'FACEBOOK'} className="p-1 text-slate-500 hover:text-primary" title="Repost">
                                {manualPosting === 'FACEBOOK' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                              </button>
                            </>
                          )}
                          {post.status === 'FAILED' && (
                            <span className="text-xs text-red-600 flex items-center gap-1" title={post.error || ''}>
                              <XCircle className="h-3.5 w-3.5" /> Failed
                              <button onClick={() => handleManualPost('FACEBOOK')} disabled={manualPosting === 'FACEBOOK'} className="p-1 text-slate-500 hover:text-primary" title="Retry">
                                <RefreshCw className={`h-3.5 w-3.5 ${manualPosting === 'FACEBOOK' ? 'animate-spin' : ''}`} />
                              </button>
                            </span>
                          )}
                          {post.status === 'PENDING' && (
                            <span className="text-xs text-yellow-600 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Pending</span>
                          )}
                        </div>
                      ) : (
                        <button onClick={() => handleManualPost('FACEBOOK')} disabled={manualPosting === 'FACEBOOK'} className="text-xs text-primary hover:underline flex items-center gap-1">
                          {manualPosting === 'FACEBOOK' ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Post Now'}
                        </button>
                      )}
                    </div>
                  )
                })()}

                {/* Instagram */}
                {(() => {
                  const post = socialPosts.find(p => p.platform === 'INSTAGRAM')
                  return (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                        <span className="text-sm font-medium">Instagram</span>
                      </div>
                      {post ? (
                        <div className="flex items-center gap-2">
                          {post.status === 'POSTED' && (
                            <>
                              <a href={post.postUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                                <CheckCircle className="h-3.5 w-3.5" /> Posted
                              </a>
                              <button onClick={() => handleManualPost('INSTAGRAM')} disabled={manualPosting === 'INSTAGRAM'} className="p-1 text-slate-500 hover:text-primary" title="Repost">
                                {manualPosting === 'INSTAGRAM' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                              </button>
                            </>
                          )}
                          {post.status === 'FAILED' && (
                            <span className="text-xs text-red-600 flex items-center gap-1" title={post.error || ''}>
                              <XCircle className="h-3.5 w-3.5" /> Failed
                              <button onClick={() => handleManualPost('INSTAGRAM')} disabled={manualPosting === 'INSTAGRAM'} className="p-1 text-slate-500 hover:text-primary" title="Retry">
                                <RefreshCw className={`h-3.5 w-3.5 ${manualPosting === 'INSTAGRAM' ? 'animate-spin' : ''}`} />
                              </button>
                            </span>
                          )}
                          {post.status === 'PENDING' && (
                            <span className="text-xs text-yellow-600 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Pending</span>
                          )}
                        </div>
                      ) : (
                        <button onClick={() => handleManualPost('INSTAGRAM')} disabled={manualPosting === 'INSTAGRAM'} className="text-xs text-primary hover:underline flex items-center gap-1">
                          {manualPosting === 'INSTAGRAM' ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Post Now'}
                        </button>
                      )}
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </form>
    </div>
  )
}
