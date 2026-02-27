'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ArrowLeft, Save, Eye, EyeOff, Trash2, Upload, File, X, Loader2,
  ImageIcon, Twitter, Linkedin, Facebook, RefreshCw, CheckCircle,
  XCircle, Clock, Send, FileText, FileSpreadsheet,
} from 'lucide-react'

const categories = [
  { value: 'GUIDES_TEMPLATES', label: 'Guides & Templates' },
  { value: 'FORMS', label: 'Forms' },
  { value: 'CHECKLISTS', label: 'Checklists' },
  { value: 'TOOLS', label: 'Tools' },
  { value: 'OTHER', label: 'Other' },
]

function getFileTypeIcon(fileType: string) {
  switch (fileType) {
    case 'PDF': return <FileText className="h-5 w-5 text-red-500" />
    case 'Excel': return <FileSpreadsheet className="h-5 w-5 text-green-500" />
    case 'Word': return <FileText className="h-5 w-5 text-blue-500" />
    default: return <File className="h-5 w-5 text-gray-500" />
  }
}

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const socialInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)
  const [socialUploading, setSocialUploading] = useState(false)
  const [coverImage, setCoverImage] = useState('')
  const [socialImage, setSocialImage] = useState('')
  const [manualPosting, setManualPosting] = useState<string | null>(null)
  const [socialPosts, setSocialPosts] = useState<Array<{
    id: string
    platform: string
    status: string
    postUrl: string | null
    error: string | null
    createdAt: string
  }>>([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'GUIDES_TEMPLATES',
    sortOrder: 0,
    isActive: true,
    fileName: '',
    fileType: '',
    fileSize: 0,
    filePath: '',
  })

  useEffect(() => {
    fetchArticle()
    fetchSocialPosts()
  }, [articleId])

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/admin/articles/${articleId}`)
      if (response.ok) {
        const article = await response.json()
        setFormData({
          title: article.title,
          slug: article.slug,
          description: article.description || '',
          category: article.category,
          sortOrder: article.sortOrder,
          isActive: article.isActive,
          fileName: article.fileName,
          fileType: article.fileType,
          fileSize: article.fileSize,
          filePath: article.filePath,
        })
        setCoverImage(article.coverImage || '')
        setSocialImage(article.socialImage || '')
      } else {
        alert('Article not found')
        router.push('/admin/articles')
      }
    } catch (error) {
      console.error('Failed to fetch article:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSocialPosts = async () => {
    try {
      const response = await fetch(`/api/admin/articles/${articleId}/social`)
      if (response.ok) {
        const data = await response.json()
        setSocialPosts(data)
      }
    } catch (error) {
      console.error('Failed to fetch social posts:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent, activate?: boolean) => {
    e.preventDefault()
    setSaving(true)

    const isActive = activate !== undefined ? activate : formData.isActive

    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          category: formData.category,
          sortOrder: formData.sortOrder,
          isActive,
          coverImage: coverImage || null,
          socialImage: socialImage || null,
        }),
      })

      if (response.ok) {
        setFormData({ ...formData, isActive })
        alert('Article updated successfully!')
        fetchSocialPosts()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update article')
      }
    } catch (error) {
      console.error('Failed to update article:', error)
      alert('Failed to update article')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, { method: 'DELETE' })
      if (response.ok) {
        router.push('/admin/articles')
      } else {
        alert('Failed to delete article')
      }
    } catch (error) {
      console.error('Failed to delete article:', error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSaving(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('title', formData.title)
      uploadFormData.append('description', formData.description)
      uploadFormData.append('category', formData.category)
      uploadFormData.append('sortOrder', formData.sortOrder.toString())
      uploadFormData.append('isActive', formData.isActive.toString())
      if (coverImage) uploadFormData.append('coverImage', coverImage)
      if (socialImage) uploadFormData.append('socialImage', socialImage)

      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'PATCH',
        body: uploadFormData,
      })

      if (response.ok) {
        const article = await response.json()
        setFormData({
          ...formData,
          fileName: article.fileName,
          fileType: article.fileType,
          fileSize: article.fileSize,
          filePath: article.filePath,
        })
        alert('File updated successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to upload file')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'cover' | 'social'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size exceeds 10MB limit.')
      return
    }

    const setUploading = type === 'cover' ? setCoverUploading : setSocialUploading
    setUploading(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/admin/articles/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (response.ok) {
        const data = await response.json()
        if (type === 'cover') {
          setCoverImage(data.url)
        } else {
          setSocialImage(data.url)
        }
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleManualPost = async (platform: string) => {
    setManualPosting(platform)
    try {
      const response = await fetch(`/api/admin/articles/${articleId}/social`, {
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
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
          <Link href="/admin/articles">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary">Edit Article</h1>
            <p className="text-text-muted mt-1">Update article details and images</p>
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
          <Button variant="outline" onClick={(e) => handleSubmit(e)} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          {formData.isActive ? (
            <Button variant="outline" onClick={(e) => handleSubmit(e, false)} disabled={saving}>
              <EyeOff className="h-4 w-4 mr-2" />
              Deactivate
            </Button>
          ) : (
            <Button className="bg-primary hover:bg-primary-light" onClick={(e) => handleSubmit(e, true)} disabled={saving}>
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
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md text-sm"
                  placeholder="Brief description of the article..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Info */}
          <Card>
            <CardHeader>
              <CardTitle>Download File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                {getFileTypeIcon(formData.fileType)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{formData.fileName}</p>
                  <p className="text-xs text-gray-500">{formData.fileType} &middot; {formatFileSize(formData.fileSize)}</p>
                </div>
                <a href={formData.filePath} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                  Preview
                </a>
              </div>
              <div>
                <Label>Replace File</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.xls,.xlsx,.doc,.docx,.txt,.zip"
                  onChange={handleFileUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Cover Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-gray-500">Displayed on website cards and detail page. Recommended: 1200 x 630px, JPG/PNG/WebP (max 10MB).</p>
              {coverImage ? (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image src={coverImage} alt="Cover" fill className="object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setCoverImage(''); if (coverInputRef.current) coverInputRef.current.value = '' }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No cover image</p>
                </div>
              )}
              <div>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => handleImageUpload(e, 'cover')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={coverUploading}
                  className="w-full"
                >
                  {coverUploading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="h-4 w-4 mr-2" /> {coverImage ? 'Replace Cover Image' : 'Upload Cover Image'}</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Social Media Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-gray-500">Recommended: 1200 x 630px, PNG/JPG, under 5MB. No SVG — social platforms reject it.</p>
              {socialImage ? (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image src={socialImage} alt="Social" fill className="object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSocialImage(''); if (socialInputRef.current) socialInputRef.current.value = '' }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <Send className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No social media image</p>
                  <p className="text-xs text-gray-400 mt-1">Cover image will be used as fallback</p>
                </div>
              )}
              <div>
                <input
                  ref={socialInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => handleImageUpload(e, 'social')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => socialInputRef.current?.click()}
                  disabled={socialUploading}
                  className="w-full"
                >
                  {socialUploading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="h-4 w-4 mr-2" /> {socialImage ? 'Replace Social Image' : 'Upload Social Image'}</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Article Info */}
          <Card>
            <CardHeader>
              <CardTitle>Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Slug</span>
                <span className="font-mono text-xs">{formData.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">File Type</span>
                <span>{formData.fileType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">File Size</span>
                <span>{formatFileSize(formData.fileSize)}</span>
              </div>
            </CardContent>
          </Card>

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
