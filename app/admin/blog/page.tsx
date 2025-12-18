'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  TrendingUp,
  Calendar,
  BookOpen,
  ExternalLink,
  Clock,
  BarChart3
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
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

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

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'published' && post.isPublished) ||
      (statusFilter === 'draft' && !post.isPublished)
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category)))]

  const publishedPosts = posts.filter(p => p.isPublished).length
  const draftPosts = posts.filter(p => !p.isPublished).length
  const totalViews = posts.reduce((sum, post) => sum + post.viewCount, 0)

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    TAX_UPDATES: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    GST_UPDATES: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    AUTOMATION_TIPS: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    COMPLIANCE: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    FFMC_RBI: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    GENERAL: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  }

  const formatCategoryName = (category: string) => {
    return category.split('_').map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">Blog Posts</h1>
          <p className="text-slate-500 mt-1">Manage your articles and publications</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Total Posts</p>
                <p className="text-2xl font-bold text-slate-900">{posts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600">Published</p>
                <p className="text-2xl font-bold text-slate-900">{publishedPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600">Drafts</p>
                <p className="text-2xl font-bold text-slate-900">{draftPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center shadow-sm">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">Total Views</p>
                <p className="text-2xl font-bold text-slate-900">{totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search posts by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {['all', 'published', 'draft'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
              {categories.slice(0, 5).map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    categoryFilter === category
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : formatCategoryName(category)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">All Posts</CardTitle>
              <CardDescription>
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-500">Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No posts found</h3>
              <p className="text-slate-500 mt-1">
                {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first blog post to get started'}
              </p>
              {!searchQuery && statusFilter === 'all' && categoryFilter === 'all' && (
                <Link href="/admin/blog/new">
                  <Button className="mt-4 bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Post</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Views</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="text-right py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPosts.map((post) => {
                    const catColors = categoryColors[post.category] || categoryColors.GENERAL

                    return (
                      <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg ${catColors.bg} flex items-center justify-center flex-shrink-0`}>
                              <FileText className={`h-5 w-5 ${catColors.text}`} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900 line-clamp-1">{post.title}</p>
                              <p className="text-sm text-slate-500 line-clamp-1 max-w-[300px]">{post.excerpt}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${catColors.bg} ${catColors.text} ${catColors.border}`}>
                            {formatCategoryName(post.category)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                            post.isPublished
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {post.isPublished ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Published
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Draft
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-slate-400" />
                            <span className="font-medium text-slate-700">{post.viewCount.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-slate-500">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">{formatDate(post.createdAt)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/blog/${post.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                              onClick={() => togglePublish(post.id, post.isPublished)}
                            >
                              {post.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deletePost(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
