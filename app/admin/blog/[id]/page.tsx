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

  useEffect(() => {
    fetchPost()
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
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your blog post content here..."
                  rows={20}
                  className="w-full px-3 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                  required
                />
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

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
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
        </div>
      </form>
    </div>
  )
}
