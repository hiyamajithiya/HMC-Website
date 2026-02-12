'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
// Using img tag for uploaded images as they're served directly by nginx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Eye, EyeOff, Trash2, Upload, X, Loader2, ImageIcon, Twitter, Linkedin, Facebook, RefreshCw, CheckCircle, XCircle, Clock, Send } from 'lucide-react'

// Dynamically import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import('@/components/editor/RichTextEditor').then(mod => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => <div className="border rounded-lg p-4 min-h-[300px] bg-gray-50 animate-pulse">Loading editor...</div>
  }
)

const categories = [
  { value: 'TAX_UPDATES', label: 'Tax Updates' },
  { value: 'GST_UPDATES', label: 'GST Updates' },
  { value: 'AUTOMATION_TIPS', label: 'Automation Tips' },
  { value: 'COMPLIANCE', label: 'Compliance' },
  { value: 'FFMC_RBI', label: 'FFMC/RBI' },
  { value: 'GENERAL', label: 'General' },
]

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'GENERAL',
    coverImage: '',
    tags: '',
    isPublished: false,
  })
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

  useEffect(() => {
    fetchPost()
    fetchSocialPosts()
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${postId}`)
      if (response.ok) {
        const post = await response.json()
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          coverImage: post.coverImage || '',
          tags: post.tags.join(', '),
          isPublished: post.isPublished,
        })
      } else {
        alert('Post not found')
        router.push('/admin/blog')
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, publish?: boolean) => {
    e.preventDefault()
    setSaving(true)

    const isPublished = publish !== undefined ? publish : formData.isPublished

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
          isPublished,
          publishedAt: isPublished && !formData.isPublished ? new Date().toISOString() : undefined,
        }),
      })

      if (response.ok) {
        setFormData({ ...formData, isPublished })
        alert('Post updated successfully!')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update post')
      }
    } catch (error) {
      console.error('Failed to update post:', error)
      alert('Failed to update post')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/blog')
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.')
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum size is 10MB.')
      return
    }

    setUploadingImage(true)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/admin/blog/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, coverImage: data.url })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, coverImage: '' })
  }

  const fetchSocialPosts = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${postId}/social`)
      if (response.ok) {
        const data = await response.json()
        setSocialPosts(data)
      }
    } catch (error) {
      console.error('Failed to fetch social posts:', error)
    }
  }

  const handleRetry = async (logId: string) => {
    setRetrying(logId)
    try {
      const response = await fetch(`/api/admin/blog/${postId}/social`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId }),
      })
      if (response.ok) {
        fetchSocialPosts()
      } else {
        const data = await response.json()
        alert(data.error || 'Retry failed')
      }
    } catch (error) {
      alert('Failed to retry')
    } finally {
      setRetrying(null)
    }
  }

  const handleManualPost = async (platform: string) => {
    setManualPosting(platform)
    try {
      const response = await fetch(`/api/admin/blog/${postId}/social`, {
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
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary">Edit Post</h1>
            <p className="text-text-muted mt-1">Update your blog post</p>
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
          {formData.isPublished ? (
            <Button
              variant="outline"
              onClick={(e) => handleSubmit(e, false)}
              disabled={saving}
            >
              <EyeOff className="h-4 w-4 mr-2" />
              Unpublish
            </Button>
          ) : (
            <Button
              className="bg-primary hover:bg-primary-light"
              onClick={(e) => handleSubmit(e, true)}
              disabled={saving}
            >
              <Eye className="h-4 w-4 mr-2" />
              Publish
            </Button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
        formData.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
      }`}>
        {formData.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        {formData.isPublished ? 'Published' : 'Draft'}
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted text-sm">/resources/blog/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="post-url-slug"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary of the post"
                  rows={3}
                  className="w-full px-3 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(html) => setFormData({ ...formData, content: html })}
                  placeholder="Write your blog post content here..."
                />
                <p className="text-xs text-text-muted">Use the toolbar above to format text, add headings, lists, tables, and more. You can also copy-paste from Word.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
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
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="tax, gst, compliance"
                />
              </div>

              </CardContent>
          </Card>

          {/* Cover Image Card */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Preview */}
              {formData.coverImage ? (
                <div className="relative">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                  <ImageIcon className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">No image selected</p>
                </div>
              )}

              {/* Upload Button */}
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="cover-image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>
                <p className="text-xs text-text-muted text-center">
                  JPG, PNG, GIF, WebP (max 10MB)
                </p>
              </div>

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-500">OR</span>
                </div>
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="coverImageUrl" className="text-sm">Image URL</Label>
                <Input
                  id="coverImageUrl"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Editor Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-text-muted space-y-3">
                <div>
                  <p className="font-semibold mb-1">Copy from Word:</p>
                  <p className="text-xs">Simply copy content from Microsoft Word and paste it directly. Tables and formatting will be preserved.</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Toolbar Features:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Bold, Italic, Underline, Highlight</li>
                    <li>Headings (H1, H2, H3)</li>
                    <li>Bullet & numbered lists</li>
                    <li>Text alignment</li>
                    <li>Links and images</li>
                    <li>Tables</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">Keyboard Shortcuts:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><code>Ctrl+B</code> - Bold</li>
                    <li><code>Ctrl+I</code> - Italic</li>
                    <li><code>Ctrl+U</code> - Underline</li>
                    <li><code>Ctrl+Z</code> - Undo</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {formData.isPublished && (
            <Card>
              <CardHeader>
                <CardTitle>View Post</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/resources/blog/${formData.slug}`} target="_blank">
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View on Website
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Social Media Posts */}
          {formData.isPublished && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Twitter status */}
                {(() => {
                  const twitterPost = socialPosts.find(p => p.platform === 'TWITTER')
                  return (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-slate-800" />
                        <span className="text-sm font-medium">X / Twitter</span>
                      </div>
                      {twitterPost ? (
                        <div className="flex items-center gap-2">
                          {twitterPost.status === 'POSTED' && (
                            <a href={twitterPost.postUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                              <CheckCircle className="h-3.5 w-3.5" /> Posted
                            </a>
                          )}
                          {twitterPost.status === 'FAILED' && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-red-600 flex items-center gap-1" title={twitterPost.error || ''}>
                                <XCircle className="h-3.5 w-3.5" /> Failed
                              </span>
                              <button
                                onClick={() => handleRetry(twitterPost.id)}
                                disabled={retrying === twitterPost.id}
                                className="p-1 text-slate-500 hover:text-primary"
                                title="Retry"
                              >
                                <RefreshCw className={`h-3.5 w-3.5 ${retrying === twitterPost.id ? 'animate-spin' : ''}`} />
                              </button>
                            </div>
                          )}
                          {twitterPost.status === 'PENDING' && (
                            <span className="text-xs text-yellow-600 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" /> Pending
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleManualPost('TWITTER')}
                          disabled={manualPosting === 'TWITTER'}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          {manualPosting === 'TWITTER' ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            'Post Now'
                          )}
                        </button>
                      )}
                    </div>
                  )
                })()}

                {/* LinkedIn status */}
                {(() => {
                  const linkedinPost = socialPosts.find(p => p.platform === 'LINKEDIN')
                  return (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-blue-700" />
                        <span className="text-sm font-medium">LinkedIn</span>
                      </div>
                      {linkedinPost ? (
                        <div className="flex items-center gap-2">
                          {linkedinPost.status === 'POSTED' && (
                            <a href={linkedinPost.postUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                              <CheckCircle className="h-3.5 w-3.5" /> Posted
                            </a>
                          )}
                          {linkedinPost.status === 'FAILED' && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-red-600 flex items-center gap-1" title={linkedinPost.error || ''}>
                                <XCircle className="h-3.5 w-3.5" /> Failed
                              </span>
                              <button
                                onClick={() => handleRetry(linkedinPost.id)}
                                disabled={retrying === linkedinPost.id}
                                className="p-1 text-slate-500 hover:text-primary"
                                title="Retry"
                              >
                                <RefreshCw className={`h-3.5 w-3.5 ${retrying === linkedinPost.id ? 'animate-spin' : ''}`} />
                              </button>
                            </div>
                          )}
                          {linkedinPost.status === 'PENDING' && (
                            <span className="text-xs text-yellow-600 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" /> Pending
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleManualPost('LINKEDIN')}
                          disabled={manualPosting === 'LINKEDIN'}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          {manualPosting === 'LINKEDIN' ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            'Post Now'
                          )}
                        </button>
                      )}
                    </div>
                  )
                })()}

                {/* Facebook status */}
                {(() => {
                  const facebookPost = socialPosts.find(p => p.platform === 'FACEBOOK')
                  return (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Facebook</span>
                      </div>
                      {facebookPost ? (
                        <div className="flex items-center gap-2">
                          {facebookPost.status === 'POSTED' && (
                            <a href={facebookPost.postUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                              <CheckCircle className="h-3.5 w-3.5" /> Posted
                            </a>
                          )}
                          {facebookPost.status === 'FAILED' && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-red-600 flex items-center gap-1" title={facebookPost.error || ''}>
                                <XCircle className="h-3.5 w-3.5" /> Failed
                              </span>
                              <button
                                onClick={() => handleRetry(facebookPost.id)}
                                disabled={retrying === facebookPost.id}
                                className="p-1 text-slate-500 hover:text-primary"
                                title="Retry"
                              >
                                <RefreshCw className={`h-3.5 w-3.5 ${retrying === facebookPost.id ? 'animate-spin' : ''}`} />
                              </button>
                            </div>
                          )}
                          {facebookPost.status === 'PENDING' && (
                            <span className="text-xs text-yellow-600 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" /> Pending
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleManualPost('FACEBOOK')}
                          disabled={manualPosting === 'FACEBOOK'}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          {manualPosting === 'FACEBOOK' ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            'Post Now'
                          )}
                        </button>
                      )}
                    </div>
                  )
                })()}

                {/* Instagram status */}
                {(() => {
                  const instagramPost = socialPosts.find(p => p.platform === 'INSTAGRAM')
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
                      {instagramPost ? (
                        <div className="flex items-center gap-2">
                          {instagramPost.status === 'POSTED' && (
                            <a href={instagramPost.postUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                              <CheckCircle className="h-3.5 w-3.5" /> Posted
                            </a>
                          )}
                          {instagramPost.status === 'FAILED' && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-red-600 flex items-center gap-1" title={instagramPost.error || ''}>
                                <XCircle className="h-3.5 w-3.5" /> Failed
                              </span>
                              <button
                                onClick={() => handleRetry(instagramPost.id)}
                                disabled={retrying === instagramPost.id}
                                className="p-1 text-slate-500 hover:text-primary"
                                title="Retry"
                              >
                                <RefreshCw className={`h-3.5 w-3.5 ${retrying === instagramPost.id ? 'animate-spin' : ''}`} />
                              </button>
                            </div>
                          )}
                          {instagramPost.status === 'PENDING' && (
                            <span className="text-xs text-yellow-600 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" /> Pending
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleManualPost('INSTAGRAM')}
                          disabled={manualPosting === 'INSTAGRAM'}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          {manualPosting === 'INSTAGRAM' ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            'Post Now'
                          )}
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
