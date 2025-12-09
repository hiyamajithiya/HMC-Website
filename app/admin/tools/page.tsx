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
  Download,
  Wrench
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

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categoryColors: Record<string, string> = {
    DOCUMENT_AUTOMATION: 'bg-blue-100 text-blue-700',
    DATA_PROCESSING: 'bg-green-100 text-green-700',
    REDACTION: 'bg-purple-100 text-purple-700',
    TAX_TOOLS: 'bg-orange-100 text-orange-700',
    COMPLIANCE: 'bg-red-100 text-red-700',
    UTILITY: 'bg-gray-100 text-gray-700',
  }

  const licenseColors: Record<string, string> = {
    FREE: 'bg-green-100 text-green-700',
    ONE_TIME: 'bg-blue-100 text-blue-700',
    ANNUAL: 'bg-purple-100 text-purple-700',
    MONTHLY: 'bg-orange-100 text-orange-700',
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">Tools</h1>
          <p className="text-text-muted mt-1">Manage your automation tools</p>
        </div>
        <Link href="/admin/tools/new">
          <Button className="bg-primary hover:bg-primary-light">
            <Plus className="h-4 w-4 mr-2" />
            Add Tool
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tools List */}
      <Card>
        <CardHeader>
          <CardTitle>All Tools ({filteredTools.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-text-muted">Loading tools...</p>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-16 w-16 mx-auto text-text-muted opacity-50" />
              <h3 className="mt-4 text-lg font-semibold text-text-primary">No tools yet</h3>
              <p className="text-text-muted mt-1">Add your first automation tool</p>
              <Link href="/admin/tools/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tool
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Tool</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">License</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Downloads</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Status</th>
                    <th className="text-right py-3 px-4 font-semibold text-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTools.map((tool) => (
                    <tr key={tool.id} className="border-b border-border-light hover:bg-bg-secondary">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-text-primary">{tool.name}</p>
                          <p className="text-sm text-text-muted truncate max-w-xs">{tool.shortDesc}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[tool.category] || 'bg-gray-100 text-gray-700'}`}>
                          {tool.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-text-muted text-sm">
                        {tool.toolType}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${licenseColors[tool.licenseType] || 'bg-gray-100 text-gray-700'}`}>
                          {tool.licenseType}
                          {tool.price && tool.price > 0 && ` - ₹${tool.price}`}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-text-muted">
                          <Download className="h-4 w-4" />
                          {tool.downloadCount}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          tool.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {tool.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          {tool.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/tools/${tool.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(tool.id, tool.isActive)}
                          >
                            {tool.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deleteTool(tool.id)}
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
