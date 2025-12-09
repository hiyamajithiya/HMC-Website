'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  FileText
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  isPublished: boolean
  publishedAt: string | null
  viewCount: number
  createdAt: string
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus }),
      })
      if (response.ok) {
        setPosts(posts.map((post) =>
          post.id === id ? { ...post, isPublished: !currentStatus } : post
        ))
      }
    } catch (error) {
      console.error('Failed to toggle publish:', error)
    }
  }

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categoryColors: Record<string, string> = {
    TAX_UPDATES: 'bg-blue-100 text-blue-700',
    GST_UPDATES: 'bg-green-100 text-green-700',
    AUTOMATION_TIPS: 'bg-purple-100 text-purple-700',
    COMPLIANCE: 'bg-orange-100 text-orange-700',
    FFMC_RBI: 'bg-red-100 text-red-700',
    GENERAL: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">Blog Posts</h1>
          <p className="text-text-muted mt-1">Manage your blog articles</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-primary hover:bg-primary-light">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>All Posts ({filteredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-text-muted">Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-text-muted opacity-50" />
              <h3 className="mt-4 text-lg font-semibold text-text-primary">No blog posts yet</h3>
              <p className="text-text-muted mt-1">Create your first blog post to get started</p>
              <Link href="/admin/blog/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Views</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Date</th>
                    <th className="text-right py-3 px-4 font-semibold text-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="border-b border-border-light hover:bg-bg-secondary">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-text-primary">{post.title}</p>
                          <p className="text-sm text-text-muted truncate max-w-xs">{post.excerpt}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                          {post.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          post.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {post.isPublished ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          {post.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-text-muted">{post.viewCount}</td>
                      <td className="py-4 px-4 text-text-muted text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/blog/${post.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePublish(post.id, post.isPublished)}
                          >
                            {post.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deletePost(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
