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
  Download,
  Wrench,
  Package,
  TrendingUp,
  Shield,
  FileCode,
  Database,
  Calculator,
  CheckCircle,
  ExternalLink
} from 'lucide-react'

interface Tool {
  id: string
  name: string
  slug: string
  shortDesc: string
  category: string
  toolType: string
  licenseType: string
  price: number | null
  downloadCount: number
  isActive: boolean
  createdAt: string
}

export default function ToolsListPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [licenseFilter, setLicenseFilter] = useState('all')

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      const response = await fetch('/api/admin/tools')
      if (response.ok) {
        const data = await response.json()
        setTools(data)
      }
    } catch (error) {
      console.error('Failed to fetch tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteTool = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return

    try {
      const response = await fetch(`/api/admin/tools/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setTools(tools.filter((tool) => tool.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete tool:', error)
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/tools/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      if (response.ok) {
        setTools(tools.map((tool) =>
          tool.id === id ? { ...tool, isActive: !currentStatus } : tool
        ))
      }
    } catch (error) {
      console.error('Failed to toggle active:', error)
    }
  }

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || tool.category === categoryFilter
    const matchesLicense = licenseFilter === 'all' || tool.licenseType === licenseFilter
    return matchesSearch && matchesCategory && matchesLicense
  })

  const categories = ['all', ...Array.from(new Set(tools.map(t => t.category)))]
  const licenses = ['all', ...Array.from(new Set(tools.map(t => t.licenseType)))]

  const totalDownloads = tools.reduce((sum, tool) => sum + tool.downloadCount, 0)
  const activeTools = tools.filter(t => t.isActive).length
  const freeTools = tools.filter(t => t.licenseType === 'FREE').length

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'DOCUMENT_AUTOMATION': return FileCode
      case 'DATA_PROCESSING': return Database
      case 'REDACTION': return Shield
      case 'TAX_TOOLS': return Calculator
      case 'COMPLIANCE': return CheckCircle
      default: return Package
    }
  }

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    DOCUMENT_AUTOMATION: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    DATA_PROCESSING: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    REDACTION: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    TAX_TOOLS: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    COMPLIANCE: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    UTILITY: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  }

  const licenseColors: Record<string, { bg: string; text: string; border: string }> = {
    FREE: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    ONE_TIME: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    ANNUAL: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    MONTHLY: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  }

  const formatCategoryName = (category: string) => {
    return category.split('_').map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  }

  const formatLicenseName = (license: string) => {
    return license.split('_').map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">Tools</h1>
          <p className="text-slate-500 mt-1">Manage your automation tools and utilities</p>
        </div>
        <Link href="/admin/tools/new">
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New Tool
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Total Tools</p>
                <p className="text-2xl font-bold text-slate-900">{tools.length}</p>
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
                <p className="text-sm font-medium text-emerald-600">Active Tools</p>
                <p className="text-2xl font-bold text-slate-900">{activeTools}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center shadow-sm">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">Total Downloads</p>
                <p className="text-2xl font-bold text-slate-900">{totalDownloads.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600">Free Tools</p>
                <p className="text-2xl font-bold text-slate-900">{freeTools}</p>
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
                placeholder="Search tools by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
              />
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

            {/* License Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
              {licenses.map((license) => (
                <button
                  key={license}
                  onClick={() => setLicenseFilter(license)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    licenseFilter === license
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {license === 'all' ? 'All Licenses' : formatLicenseName(license)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tools List */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">All Tools</CardTitle>
              <CardDescription>
                {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-500">Loading tools...</p>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                <Wrench className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No tools found</h3>
              <p className="text-slate-500 mt-1">
                {searchQuery || categoryFilter !== 'all' || licenseFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add your first automation tool'}
              </p>
              {!searchQuery && categoryFilter === 'all' && licenseFilter === 'all' && (
                <Link href="/admin/tools/new">
                  <Button className="mt-4 bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tool
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tool</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">License</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Downloads</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTools.map((tool) => {
                    const CategoryIcon = getCategoryIcon(tool.category)
                    const catColors = categoryColors[tool.category] || categoryColors.UTILITY
                    const licColors = licenseColors[tool.licenseType] || licenseColors.FREE

                    return (
                      <tr key={tool.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${catColors.bg} flex items-center justify-center`}>
                              <CategoryIcon className={`h-5 w-5 ${catColors.text}`} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900">{tool.name}</p>
                              <p className="text-sm text-slate-500 truncate max-w-[250px]">{tool.shortDesc}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${catColors.bg} ${catColors.text} ${catColors.border}`}>
                            {formatCategoryName(tool.category)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${licColors.bg} ${licColors.text} ${licColors.border}`}>
                              {formatLicenseName(tool.licenseType)}
                            </span>
                            {tool.price && tool.price > 0 && (
                              <span className="text-xs font-semibold text-slate-700">₹{tool.price.toLocaleString()}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Download className="h-4 w-4 text-slate-400" />
                            <span className="font-medium text-slate-700">{tool.downloadCount.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                            tool.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {tool.isActive ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Active
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/tools/${tool.slug}`} target="_blank">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/tools/${tool.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                              onClick={() => toggleActive(tool.id, tool.isActive)}
                            >
                              {tool.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteTool(tool.id)}
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
