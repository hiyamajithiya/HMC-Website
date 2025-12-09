'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Eye } from 'lucide-react'

const categories = [
  { value: 'TAX_UPDATES', label: 'Tax Updates' },
  { value: 'GST_UPDATES', label: 'GST Updates' },
  { value: 'AUTOMATION_TIPS', label: 'Automation Tips' },
  { value: 'COMPLIANCE', label: 'Compliance' },
  { value: 'FFMC_RBI', label: 'FFMC/RBI' },
  { value: 'GENERAL', label: 'General' },
]

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
          isPublished: publish,
          publishedAt: publish ? new Date().toISOString() : null,
        }),
      })

      if (response.ok) {
        router.push('/admin/blog')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to create post')
      }
    } catch (error) {
      console.error('Failed to create post:', error)
      alert('Failed to create post')
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-3xl font-heading font-bold text-text-primary">New Blog Post</h1>
            <p className="text-text-muted mt-1">Create a new article for your website</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button
            className="bg-primary hover:bg-primary-light"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
          >
            <Eye className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  onChange={handleTitleChange}
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
                  placeholder="Brief summary of the post (shown in listings)"
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
                  placeholder="Write your blog post content here... (Markdown supported)"
                  rows={20}
                  className="w-full px-3 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                  required
                />
                <p className="text-xs text-text-muted">Supports Markdown formatting</p>
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
                  placeholder="tax, gst, compliance (comma separated)"
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
                <p className="text-xs text-text-muted">Enter a URL for the cover image</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Help</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-text-muted space-y-2">
                <p><strong>Markdown Tips:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li><code># Heading 1</code></li>
                  <li><code>## Heading 2</code></li>
                  <li><code>**bold text**</code></li>
                  <li><code>*italic text*</code></li>
                  <li><code>- List item</code></li>
                  <li><code>[Link](url)</code></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
